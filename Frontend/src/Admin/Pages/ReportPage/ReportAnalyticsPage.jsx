import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    Statistic,
    DatePicker,
    Select,
    Button,
    Checkbox,
    Dropdown,
    Space,
    Spin,
    Typography
} from "antd";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import StatisticsService from "../../../services/StatisticsService";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportAnalyticsPage = () => {
    const [overview, setOverview] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(null);
    const [branchFilter, setBranchFilter] = useState([]);
    const [channelFilter, setChannelFilter] = useState([]);

    const branches = ["Tất cả", "Địa điểm mặc định"];
    const channels = ["Website", "POS", "Facebook", "Draft", "Zalo", "Phone"];

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [overviewData, monthlyData] = await Promise.all([
                StatisticsService.getOverview({
                    year,
                    month: month || undefined,
                    branchFilter,
                    channelFilter
                }),
                StatisticsService.getMonthly(year)
            ]);
            setOverview(overviewData);
            setMonthly(monthlyData.reverse());
        } catch (err) {
            console.error("Lỗi khi tải thống kê:", err);
            setOverview({ totalRevenue: 0, totalOrders: 0, byStatus: [] });
            setMonthly([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatCurrency = (val) => `${val.toLocaleString()} đ`;

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("BÁO CÁO THỐNG KÊ", 14, 20);
        doc.text(`Năm: ${year}${month ? ` - Tháng: ${month}` : ""}`, 14, 30);
        doc.text(`Tổng doanh thu: ${formatCurrency(overview.totalRevenue)}`, 14, 40);
        doc.text(`Tổng đơn hàng: ${overview.totalOrders}`, 14, 50);

        autoTable(doc, {
            startY: 60,
            head: [["Trạng thái", "Số lượng"]],
            body: overview.byStatus.map((s) => [s.Status, s.count])
        });

        autoTable(doc, {
            startY: doc.autoTable.previous.finalY + 10,
            head: [["Tháng", "Doanh thu", "Số đơn"]],
            body: monthly.map((m) => [`Tháng ${m.month}`, formatCurrency(m.revenue), m.orders])
        });

        doc.save(`BaoCao_${year}_${month || "CaNam"}.pdf`);
    };

    const exportExcel = () => {
        const wsData = [["Tháng", "Doanh thu", "Số đơn"]].concat(
            monthly.map((m) => [`Tháng ${m.month}`, m.revenue, m.orders])
        );
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "BaoCao");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), `BaoCao_${year}_${month || "CaNam"}.xlsx`);
    };

    const branchMenu = (
        <Checkbox.Group value={branchFilter} onChange={setBranchFilter}>
            {branches.map((b) => (
                <Checkbox key={b} value={b}>{b}</Checkbox>
            ))}
        </Checkbox.Group>
    );

    const channelMenu = (
        <Checkbox.Group value={channelFilter} onChange={setChannelFilter}>
            {channels.map((c) => (
                <Checkbox key={c} value={c}>{c}</Checkbox>
            ))}
        </Checkbox.Group>
    );

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Tổng quan</Title>

            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
                <Col><Select defaultValue={year} onChange={setYear} style={{ width: 120 }}>{[...Array(5)].map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <Option key={y} value={y}>{y}</Option>;
                })}</Select></Col>

                <Col><Select placeholder="Tháng" allowClear onChange={setMonth} style={{ width: 120 }}>{Array.from({ length: 12 }, (_, i) => <Option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</Option>)}</Select></Col>

                <Col><Dropdown overlay={branchMenu} trigger={["click"]}><Button>Chi nhánh: {branchFilter.length ? branchFilter.join(", ") : "Tất cả"}</Button></Dropdown></Col>

                <Col><Dropdown overlay={channelMenu} trigger={["click"]}><Button>Kênh bán: {channelFilter.length ? channelFilter.join(", ") : "Tất cả"}</Button></Dropdown></Col>

                <Col><Button type="primary" onClick={fetchStats}>Áp dụng</Button></Col>
                <Col><Button onClick={exportPDF}>Xuất PDF</Button></Col>
                <Col><Button onClick={exportExcel}>Xuất Excel</Button></Col>
            </Row>

            {loading ? <Spin tip="Đang tải dữ liệu..." /> : (
                <>
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={6}><Card><Statistic title="Số đơn hàng" value={overview.totalOrders} /></Card></Col>
                        <Col span={6}><Card><Statistic title="Hoàn trả" value="0 đ" /></Card></Col>
                        <Col span={6}><Card><Statistic title="Doanh thu thuần" value={formatCurrency(overview.totalRevenue)} /></Card></Col>
                        <Col span={6}><Card><Statistic title="Thực nhận" value="0 đ" /></Card></Col>
                    </Row>

                    <Card title="Doanh thu theo tháng">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthly}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
                                <Bar dataKey="orders" fill="#82ca9d" name="Số đơn" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </>
            )}
        </div>
    );
};

export default ReportAnalyticsPage;