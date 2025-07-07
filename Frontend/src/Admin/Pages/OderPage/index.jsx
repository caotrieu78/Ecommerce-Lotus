// OrderPage.jsx
import React, { useEffect, useState } from "react";
import {
    Table, Tabs, Button, Badge, Collapse, Descriptions,
    Space, message, Tooltip, Input
} from "antd";
import {
    EyeOutlined, DeleteOutlined, PlusOutlined, ExportOutlined
} from "@ant-design/icons";
import OrderService from "../../../services/orderService";
import ShippingService from "../../../services/ShippingService";
import PaymentService from "../../../services/PaymentService";
import ConfirmModal from "../../../components/ConfirmModal";
import OrderModal from "./OrderModal";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [shippingInfos, setShippingInfos] = useState({});
    const [paymentInfos, setPaymentInfos] = useState({});
    const [confirmModal, setConfirmModal] = useState({ show: false, orderId: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await OrderService.getAllForAdmin();
            setOrders(data);

            const paymentMap = {};
            for (let order of data) {
                try {
                    const payment = await PaymentService.getByOrderId(order.OrderID);
                    paymentMap[order.OrderID] = payment;
                } catch {
                    paymentMap[order.OrderID] = null;
                }
            }
            setPaymentInfos(paymentMap);
        } catch {
            message.error("Không thể tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleExpand = async (id) => {
        if (expandedRowKeys.includes(id)) {
            setExpandedRowKeys(prev => prev.filter(key => key !== id));
            return;
        }

        try {
            const shipping = await ShippingService.getByOrderId(id);
            setShippingInfos(prev => ({ ...prev, [id]: shipping }));
        } catch {
            setShippingInfos(prev => ({ ...prev, [id]: null }));
        }

        try {
            const payment = await PaymentService.getByOrderId(id);
            setPaymentInfos(prev => ({ ...prev, [id]: payment }));
        } catch {
            setPaymentInfos(prev => ({ ...prev, [id]: null }));
        }

        setExpandedRowKeys(prev => [...prev, id]);
    };

    const handleDelete = async () => {
        try {
            await OrderService.remove(confirmModal.orderId);
            message.success("Xoá thành công");
            fetchOrders();
        } catch {
            message.error("Xoá thất bại");
        } finally {
            setConfirmModal({ show: false, orderId: null });
        }
    };

    const expandedRowRender = (order) => {
        const shipping = shippingInfos[order.OrderID];
        const payment = paymentInfos[order.OrderID];

        return (
            <Collapse defaultActiveKey={["1"]} ghost>
                <Panel header={<b>Chi tiết đơn hàng</b>} key="1">
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Khách hàng">{order.user?.FullName}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{shipping?.Phone || "--"}</Descriptions.Item>
                        <Descriptions.Item label="Người nhận">{shipping?.RecipientName || "--"}</Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ">{shipping?.Address || "--"}</Descriptions.Item>
                        <Descriptions.Item label="Thành phố">{shipping?.City || "--"}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái giao hàng">{shipping?.ShippingStatus || "Chưa có"}</Descriptions.Item>
                        <Descriptions.Item label="Phương thức thanh toán">{payment?.PaymentMethod || "--"}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái thanh toán">{payment?.PaymentStatus || "Chưa thanh toán"}</Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">{Number(order.TotalAmount).toLocaleString()} đ</Descriptions.Item>
                        <Descriptions.Item label="Ghi chú">
                            <Input.TextArea
                                defaultValue={order.Note || ""}
                                placeholder="Ghi chú đơn hàng..."
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                disabled
                            />
                        </Descriptions.Item>
                    </Descriptions>

                    <div className="mt-3" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Button icon={<i className="fas fa-archive" />} disabled>Lưu trữ</Button>
                        <Button icon={<i className="fas fa-print" />} onClick={() => window.print()}>In đơn hàng</Button>
                        <Button danger onClick={() => setConfirmModal({ show: true, orderId: order.OrderID })}>Huỷ đơn hàng</Button>
                        <Button
                            type="primary"
                            onClick={async () => {
                                try {
                                    const payment = paymentInfos[order.OrderID];
                                    if (!payment) return message.warning("Chưa có thông tin thanh toán");

                                    await PaymentService.confirm(payment.PaymentID);
                                    message.success("Đã xác nhận thanh toán");

                                    const newPayment = await PaymentService.getByOrderId(order.OrderID);
                                    setPaymentInfos(prev => ({ ...prev, [order.OrderID]: newPayment }));
                                    fetchOrders();
                                } catch (err) {
                                    message.error(err.message || "Không thể xác nhận thanh toán");
                                }
                            }}
                        >
                            Xác nhận thanh toán | {Number(order.TotalAmount).toLocaleString()} đ
                        </Button>
                        <Button onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>Xem chi tiết</Button>
                    </div>
                </Panel>
            </Collapse>
        );
    };

    const columns = [
        {
            title: "Mã",
            dataIndex: "OrderID",
            render: (id) => <a href="#">#{id}</a>,
        },
        {
            title: "Ngày tạo",
            dataIndex: "OrderDate",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Khách hàng",
            render: (_, record) => record.user?.FullName || record.user?.Username,
        },
        {
            title: "Thanh toán",
            render: (_, record) => {
                const payment = paymentInfos[record.OrderID];
                const status = payment?.PaymentStatus || "Chưa thanh toán";

                let badgeStatus = "default";
                if (status === "Completed") badgeStatus = "success";
                else if (status === "Pending") badgeStatus = "processing";
                else if (status === "Failed") badgeStatus = "error";

                const labelMap = {
                    Pending: "Đang xử lý",
                    Completed: "Đã thanh toán",
                    Failed: "Thất bại",
                    default: "Chưa thanh toán"
                };

                return <Badge status={badgeStatus} text={labelMap[status] || labelMap.default} />;
            },
        },
        {
            title: "Giao hàng",
            render: (_, record) => (
                <Badge status="warning" text={record.ShippingStatus || "Chưa giao"} />
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "TotalAmount",
            render: (total) => `${total.toLocaleString()} đ`,
        },
        {
            title: "Kênh",
            render: () => "web",
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button icon={<EyeOutlined />} onClick={() => handleExpand(record.OrderID)} />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button icon={<DeleteOutlined />} danger onClick={() => setConfirmModal({ show: true, orderId: record.OrderID })} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        const customerName = order.user?.FullName?.toLowerCase() || "";
        const orderId = `${order.OrderID}`.toLowerCase();

        const matchesSearch = customerName.includes(searchLower) || orderId.includes(searchLower);

        if (activeTab === "unpaid") {
            const payment = paymentInfos[order.OrderID];
            return matchesSearch && (!payment || payment.PaymentStatus !== "Completed");
        }

        if (activeTab === "undelivered") {
            return matchesSearch && (!order.ShippingStatus || order.ShippingStatus === "Chưa giao");
        }

        return matchesSearch;
    });

    const handleCreateOrder = () => {
        const newOrder = {
            OrderID: "Mới",
            user: { FullName: "" },
            OrderDate: new Date().toISOString(),
            TotalAmount: 0,
            PaymentMethod: "---",
            PaymentStatus: "CHƯA THANH TOÁN",
            Status: "Chưa xử lý",
            details: []
        };
        setSelectedOrder(newOrder);
        setShowOrderModal(true);
    };

    return (
        <div className="container mt-4">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2>Danh sách đơn hàng</h2>
                <Space>
                    <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder}>Tạo đơn hàng</Button>
                </Space>
            </div>

            <Tabs defaultActiveKey="all" onChange={(key) => setActiveTab(key)}>
                <TabPane tab="Tất cả đơn hàng" key="all" />
                <TabPane tab="Đơn hàng mới" key="new" disabled />
                <TabPane tab="Chưa giao hàng" key="undelivered" />
                <TabPane tab="Chưa thanh toán" key="unpaid" />
            </Tabs>

            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm theo mã hoặc tên khách hàng"
                    allowClear
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                loading={loading}
                dataSource={filteredOrders}
                columns={columns}
                rowKey="OrderID"
                expandable={{
                    expandedRowRender,
                    expandedRowKeys,
                    onExpandedRowsChange: setExpandedRowKeys,
                }}
            />

            <ConfirmModal
                show={confirmModal.show}
                title="Xác nhận huỷ đơn hàng"
                message={`Bạn có chắc chắn muốn huỷ đơn hàng #${confirmModal.orderId}?`}
                onConfirm={handleDelete}
                onClose={() => setConfirmModal({ show: false, orderId: null })}
            />

            {selectedOrder && (
                <OrderModal
                    show={showOrderModal}
                    onHide={() => setShowOrderModal(false)}
                    order={selectedOrder}
                />
            )}
        </div>
    );
};

export default OrderPage;
