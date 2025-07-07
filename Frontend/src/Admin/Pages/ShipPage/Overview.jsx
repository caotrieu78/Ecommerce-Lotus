import React, { useEffect, useState } from "react";
import {
    Card,
    Col,
    Row,
    Typography,
    Select,
    Checkbox,
    Spin,
    message,
} from "antd";
import {
    ShoppingCartOutlined,
    CarOutlined,
    UndoOutlined,
    AuditOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import OrderService from "../../../services/orderService";
import ShippingService from "../../../services/ShippingService";
import PaymentService from "../../../services/PaymentService";

const { Title, Text } = Typography;
const { Option } = Select;

const cardStyle = {
    textAlign: "center",
    borderRadius: 8,
};

const StatisticCard = ({ label, value, weight, color = "#333", highlight = false }) => (
    <Card style={cardStyle} bordered>
        <Text style={{ color: highlight ? "red" : color }}>{label}</Text>
        <div style={{ fontSize: 20, fontWeight: 600, color: highlight ? "red" : "#1677ff" }}>{value}</div>
        <div style={{ fontSize: 12 }}>{weight}</div>
    </Card>
);

const Section = ({ icon, title, children }) => (
    <>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24 }}>
            {icon}
            <Title level={5} style={{ margin: 0 }}>{title}</Title>
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
            {children}
        </Row>
    </>
);

const Overview = () => {
    const [loading, setLoading] = useState(false);
    const [overviewData, setOverviewData] = useState({
        order: { unverified: 0, unpaid: 0, undelivered: 0, amount: 0 },
        shipping: { waiting: 0, delivering: 0, failed: 0, weight: 0 },
        return: { waitingReturn: 0, returnedNotInStock: 0, weight: 0 },
        reconciliation: { unbalanced: 0, codUnreceived: 0, weight: 0 },
    });
    const [timeFilter, setTimeFilter] = useState("7");

    const fetchOverview = async () => {
        setLoading(true);
        try {
            const orders = await OrderService.getAllForAdmin();

            let unpaid = 0, unverified = 0, undelivered = 0, amount = 0;

            const paymentInfos = {};
            const shippingInfos = {};

            const now = new Date();
            const daysAgo = parseInt(timeFilter, 10);

            for (let order of orders) {
                const orderDate = new Date(order.CreatedAt || order.createdAt || order.created_at);
                const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

                if (diffDays > daysAgo) continue;

                try {
                    const payment = await PaymentService.getByOrderId(order.OrderID);
                    paymentInfos[order.OrderID] = payment;
                } catch { }

                try {
                    const shipping = await ShippingService.getByOrderId(order.OrderID);
                    shippingInfos[order.OrderID] = shipping;
                } catch { }

                if (!order.Verified) unverified++;
                if (!order.ShippingStatus || order.ShippingStatus === "Chưa giao") undelivered++;

                const payment = paymentInfos[order.OrderID];
                if (!payment || payment.PaymentStatus !== "Completed") unpaid++;

                amount += Number(order.TotalAmount);
            }

            const weight = 0;

            setOverviewData({
                order: { unverified, unpaid, undelivered, amount },
                shipping: { waiting: 0, delivering: 0, failed: 0, weight },
                return: { waitingReturn: 0, returnedNotInStock: 0, weight },
                reconciliation: { unbalanced: 0, codUnreceived: 0, weight },
            });
        } catch (err) {
            message.error("Không thể tải dữ liệu tổng quan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview();
    }, [timeFilter]);

    const formatCurrency = (num) => num.toLocaleString("vi-VN") + " đ";
    const formatWeight = (g) => `${g} g`;

    const exportToExcel = () => {
        const { order, shipping, return: returnStat, reconciliation } = overviewData;

        const data = [
            { Section: "Đơn hàng", Label: "Đơn chưa xác thực", Value: order.unverified, Weight: formatCurrency(order.amount) },
            { Section: "Đơn hàng", Label: "Chờ thanh toán", Value: order.unpaid, Weight: formatCurrency(order.amount) },
            { Section: "Đơn hàng", Label: "Chưa giao hàng", Value: order.undelivered, Weight: formatCurrency(order.amount) },

            { Section: "Giao hàng", Label: "Chờ lấy hàng", Value: shipping.waiting, Weight: formatWeight(shipping.weight) },
            { Section: "Giao hàng", Label: "Đang giao hàng", Value: shipping.delivering, Weight: formatWeight(shipping.weight) },
            { Section: "Giao hàng", Label: "Không gặp khách", Value: shipping.failed, Weight: formatWeight(shipping.weight) },

            { Section: "Hoàn hàng", Label: "Chờ chuyển hoàn", Value: returnStat.waitingReturn, Weight: formatWeight(returnStat.weight) },
            { Section: "Hoàn hàng", Label: "Đã chuyển hoàn, chưa nhập kho", Value: returnStat.returnedNotInStock, Weight: formatWeight(returnStat.weight) },

            { Section: "Đối soát", Label: "Đơn chưa đối soát", Value: reconciliation.unbalanced, Weight: formatWeight(reconciliation.weight) },
            { Section: "Đối soát", Label: "Chưa nhận COD", Value: reconciliation.codUnreceived, Weight: formatWeight(reconciliation.weight) },
        ];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tổng Quan");

        const filename = `Tong_quan_${timeFilter}_ngay.xlsx`;
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, filename);
    };

    const { order, shipping, return: returnStat, reconciliation } = overviewData;

    if (loading) {
        return <Spin tip="Đang tải dữ liệu..." style={{ marginTop: 60 }} />;
    }

    return (
        <div style={{ padding: 24 }}>
            {/* Header filter */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Select defaultValue="7" style={{ width: 160 }} onChange={setTimeFilter}>
                        <Option value="7">7 ngày trước</Option>
                        <Option value="30">30 ngày trước</Option>
                    </Select>
                    <Checkbox style={{ marginLeft: 16 }}>Cập nhật liên tục</Checkbox>
                </Col>
                <Col>
                    <Text strong style={{ cursor: "pointer", marginRight: 16 }}>Toàn màn hình</Text>
                    <Text strong onClick={exportToExcel} style={{ cursor: "pointer", color: "#1677ff" }}>
                        Xuất Excel
                    </Text>
                </Col>
            </Row>

            {/* Đơn hàng */}
            <Section icon={<ShoppingCartOutlined style={{ fontSize: 18, color: "#52c41a" }} />} title="Đơn hàng">
                <Col span={8}>
                    <StatisticCard label="Đơn chưa xác thực" value={order.unverified} weight={formatCurrency(order.amount)} />
                </Col>
                <Col span={8}>
                    <StatisticCard label="Chờ thanh toán" value={order.unpaid} weight={formatCurrency(order.amount)} />
                </Col>
                <Col span={8}>
                    <StatisticCard label="Chưa giao hàng" value={order.undelivered} weight={formatCurrency(order.amount)} />
                </Col>
            </Section>

            {/* Giao hàng */}
            <Section icon={<CarOutlined style={{ fontSize: 18, color: "#fa8c16" }} />} title="Giao hàng">
                <Col span={8}><StatisticCard label="Chờ lấy hàng" value={shipping.waiting} weight={formatWeight(shipping.weight)} /></Col>
                <Col span={8}><StatisticCard label="Đang giao hàng" value={shipping.delivering} weight={formatWeight(shipping.weight)} /></Col>
                <Col span={8}><StatisticCard label="Không gặp khách" value={`${shipping.failed} đơn`} weight={formatWeight(shipping.weight)} highlight /></Col>
            </Section>

            {/* Hoàn hàng */}
            <Section icon={<UndoOutlined style={{ fontSize: 18, color: "#13c2c2" }} />} title="Hoàn hàng">
                <Col span={12}><StatisticCard label="Chờ chuyển hoàn" value={returnStat.waitingReturn} weight={formatWeight(returnStat.weight)} /></Col>
                <Col span={12}><StatisticCard label="Đã chuyển hoàn, chưa nhập kho" value={returnStat.returnedNotInStock} weight={formatWeight(returnStat.weight)} /></Col>
            </Section>

            {/* Đối soát */}
            <Section icon={<AuditOutlined style={{ fontSize: 18, color: "#722ed1" }} />} title="Đối soát">
                <Col span={12}><StatisticCard label="Đơn chưa đối soát" value={reconciliation.unbalanced} weight={formatWeight(reconciliation.weight)} /></Col>
                <Col span={12}><StatisticCard label="Chưa nhận COD" value={reconciliation.codUnreceived} weight={formatWeight(reconciliation.weight)} /></Col>
            </Section>
        </div>
    );
};

export default Overview;
