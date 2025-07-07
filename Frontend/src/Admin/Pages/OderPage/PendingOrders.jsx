import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, message } from "antd";
import OrderService from "../../../services/orderService";

const { Link } = Typography;

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPendingOrders = async () => {
        setLoading(true);
        try {
            const allOrders = await OrderService.getAllForAdmin();

            const filtered = allOrders.filter(
                order => order.Status === "Pending" || order.Status === "Paid"
            );

            setOrders(filtered);
        } catch {
            message.error("Không thể tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "OrderID",
            render: id => <Link href={`/admin/orders/${id}`}>{id}</Link>,
        },
        {
            title: "Ngày tạo",
            dataIndex: "OrderDate",
            render: date => new Date(date).toLocaleString("vi-VN"),
        },
        {
            title: "Cập nhật lần cuối",
            dataIndex: "updated_at",
            render: date => new Date(date).toLocaleString("vi-VN"),
        },
        {
            title: "Khách hàng",
            dataIndex: "user",
            render: user =>
                user ? (
                    <Link href={`/admin/users/${user.UserID}`}>
                        {user.FullName || user.Username}
                    </Link>
                ) : (
                    "--"
                ),
        },
        {
            title: "Khu vực",
            render: () => "Vietnam",
        },
        {
            title: "Tổng tiền",
            dataIndex: "TotalAmount",
            render: amount => `${Number(amount).toLocaleString()} ₫`,
        },
        {
            title: "Trạng thái",
            dataIndex: "Status",
            render: () => (
                <Tag color="#fadb14" style={{ color: "#614700", fontWeight: "bold" }}>
                    Chưa hoàn tất
                </Tag>
            ),
        },
        {
            title: "Kênh",
            render: () => "web",
        },
    ];
    return (
        <div className="p-4">
            <h2 className="fw-bold mb-3">Đơn hàng chưa hoàn tất</h2>
            <Table
                rowKey="OrderID"
                columns={columns}
                dataSource={orders}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default PendingOrders;
