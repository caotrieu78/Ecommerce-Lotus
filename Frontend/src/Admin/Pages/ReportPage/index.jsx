import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    Input,
    Tag,
    Table,
    Button,
    Typography,
    Space,
    Spin
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

const mockData = [
    {
        key: "1",
        name: "Tháng hiện tại",
        category: "Bán hàng",
        lastViewed: "02/07/2025",
        createdBy: "Admin"
    },
    {
        key: "2",
        name: "Doanh thu theo thời gian giao và kho xuất",
        category: "Bán hàng",
        lastViewed: "--",
        createdBy: "Admin"
    },
    {
        key: "3",
        name: "Công nợ khách hàng",
        category: "Tài chính",
        lastViewed: "--",
        createdBy: "Admin"
    },
    {
        key: "4",
        name: "Công nợ nhà cung cấp",
        category: "Tài chính",
        lastViewed: "--",
        createdBy: "Admin"
    },
    {
        key: "5",
        name: "Tổng doanh thu hàng hoá và thuế VAT",
        category: "Bán hàng",
        lastViewed: "--",
        createdBy: "Admin"
    },
    {
        key: "6",
        name: "Hiệu quả khuyến mãi",
        category: "Bán hàng",
        lastViewed: "--",
        createdBy: "Admin"
    },
    {
        key: "7",
        name: "Kênh sản thương mại điện tử",
        category: "Bán hàng",
        lastViewed: "--",
        createdBy: "Admin"
    },
    {
        key: "8",
        name: "PageViews-Tháng hiện tại",
        category: "Website",
        lastViewed: "--",
        createdBy: "Admin"
    }
];

const columns = [
    {
        title: "Báo cáo",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>
    },
    {
        title: "Danh mục",
        dataIndex: "category",
        key: "category",
        render: (category) => <Tag>{category}</Tag>
    },
    {
        title: "Xem gần nhất",
        dataIndex: "lastViewed",
        key: "lastViewed"
    },
    {
        title: "Người tạo",
        dataIndex: "createdBy",
        key: "createdBy",
        render: () => <img src="/images/Admin-icon.png" alt="Admin" style={{ height: 20 }} />
    }
];

const ReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");

    const filteredData = mockData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Danh sách báo cáo</Title>

            <div style={{ marginBottom: 24 }}>
                <Input
                    placeholder="Nhập tên báo cáo bạn muốn tìm"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 400 }}
                />
            </div>

            {loading ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 6 }}
                    rowKey="key"
                />
            )}
        </div>
    );
};

export default ReportPage;
