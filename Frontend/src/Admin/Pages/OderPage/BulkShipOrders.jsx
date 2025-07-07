import React from "react";
import { Typography, Card, Table, Button, Space } from "antd";
import { TruckOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const BulkShipOrders = () => {
    // Dữ liệu mẫu (có thể thay bằng props hoặc API sau)
    const dataSource = [
        {
            key: '1',
            orderId: 'DH001',
            customer: 'Nguyễn Văn A',
            address: '123 Lê Lợi, Q1, TP.HCM',
            status: 'Chờ giao',
        },
        {
            key: '2',
            orderId: 'DH002',
            customer: 'Trần Thị B',
            address: '456 Hai Bà Trưng, Q3, TP.HCM',
            status: 'Chờ giao',
        },
    ];

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderId',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customer',
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    <Button type="link" icon={<TruckOutlined />}>Giao hàng</Button>
                    <Button type="link" danger>Xoá</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Title level={3}>Giao hàng hàng loạt</Title>
                <Paragraph>Trang danh sách đơn hàng đang chuẩn bị giao theo hình thức hàng loạt.</Paragraph>

                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button icon={<ReloadOutlined />}>Tải lại danh sách</Button>
                </div>

                <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default BulkShipOrders;
