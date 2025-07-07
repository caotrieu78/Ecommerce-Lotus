import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    Typography,
    Tag,
    Spin,
    message,
    Descriptions,
    List,
    Divider,
    Avatar,
    Progress,
    Tooltip,
    Table,
} from "antd";
import UserService from "../../../services/userService";
import {
    EyeOutlined,
    HeartOutlined,
    StarFilled,
    ShoppingCartOutlined,
    SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const fakeData = {
    keywords: ["áo thun", "giày sneaker", "quần short", "mũ lưỡi trai"],
    viewedStats: {
        daily: 5,
        weekly: 24,
        monthly: 98,
    },
    trafficSources: {
        Facebook: 35,
        Google: 45,
        Zalo: 15,
        Direct: 5,
    },
    ratings: [
        {
            product: "Áo Polo Nam",
            rating: 4,
            comment: "Chất vải mịn, mặc thoáng, giao hàng nhanh.",
        },
        {
            product: "Giày Sneaker Nữ",
            rating: 5,
            comment: "Cực kỳ ưng ý, đúng size, đẹp hơn hình!",
        },
    ],
    favorites: [
        {
            name: "Quần Jogger Nam",
            image: "https://via.placeholder.com/60",
        },
        {
            name: "Áo Hoodie Oversize",
            image: "https://via.placeholder.com/60",
        },
    ],
    orderHistory: [
        {
            orderId: "ORD12345",
            date: "2024-06-20",
            total: "520.000 ₫",
            status: "Đã giao",
        },
        {
            orderId: "ORD12312",
            date: "2024-05-12",
            total: "990.000 ₫",
            status: "Đã hủy",
        },
    ],
};

const UserDetailPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await UserService.getById(id);
                setUser(res);
            } catch {
                message.error("Không thể tải thông tin khách hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading || !user) return <Spin tip="Đang tải..." />;

    const orderColumns = [
        {
            title: "Mã đơn",
            dataIndex: "orderId",
        },
        {
            title: "Ngày đặt",
            dataIndex: "date",
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) =>
                status === "Đã giao" ? (
                    <Tag color="green">Đã giao</Tag>
                ) : (
                    <Tag color="red">Đã hủy</Tag>
                ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Thông tin khách hàng</Title>

            {/* Thông tin cơ bản */}
            <Card bordered style={{ marginBottom: 24 }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Họ tên">{user.FullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.Email}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {user.IsActive ? (
                            <Tag color="green">Hoạt động</Tag>
                        ) : (
                            <Tag color="red">Khoá</Tag>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                        {user.Address || "Chưa có"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng số đơn">2</Descriptions.Item>
                    <Descriptions.Item label="Tổng chi tiêu">1.510.000 ₫</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Tần suất xem sản phẩm */}
            <Card title={<><EyeOutlined /> Tần suất xem sản phẩm</>} style={{ marginBottom: 24 }}>
                <p>Trong ngày: <strong>{fakeData.viewedStats.daily} lần</strong></p>
                <p>Trong tuần: <strong>{fakeData.viewedStats.weekly} lần</strong></p>
                <p>Trong tháng: <strong>{fakeData.viewedStats.monthly} lần</strong></p>
            </Card>

            {/* Từ khóa quan tâm */}
            <Card title={<><SearchOutlined /> Từ khóa người dùng tìm kiếm</>} style={{ marginBottom: 24 }}>
                {fakeData.keywords.map((kw, idx) => (
                    <Tag color="blue" key={idx}>{kw}</Tag>
                ))}
            </Card>

            {/* Nguồn truy cập */}
            <Card title={<><ShoppingCartOutlined /> Nguồn truy cập sản phẩm</>} style={{ marginBottom: 24 }}>
                {Object.entries(fakeData.trafficSources).map(([source, percent]) => (
                    <div key={source} style={{ marginBottom: 8 }}>
                        <Tooltip title={`${percent}%`}>
                            <Text strong>{source}</Text>
                            <Progress percent={percent} showInfo={false} strokeColor="#1890ff" />
                        </Tooltip>
                    </div>
                ))}
            </Card>

            {/* Đánh giá sản phẩm */}
            <Card title={<><StarFilled /> Đánh giá của khách hàng</>} style={{ marginBottom: 24 }}>
                <List
                    itemLayout="vertical"
                    dataSource={fakeData.ratings}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Text strong>{item.product}</Text>}
                                description={
                                    <div>
                                        {[...Array(item.rating)].map((_, i) => (
                                            <StarFilled key={i} style={{ color: "#fadb14" }} />
                                        ))}
                                    </div>
                                }
                            />
                            <Text>{item.comment}</Text>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Sản phẩm yêu thích */}
            <Card title={<><HeartOutlined /> Sản phẩm yêu thích</>} style={{ marginBottom: 24 }}>
                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={fakeData.favorites}
                    renderItem={(item) => (
                        <List.Item>
                            <Card>
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size={64} src={item.image} />}
                                    title={item.name}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>

            {/* Lịch sử đơn hàng */}
            <Card title={<><ShoppingCartOutlined /> Lịch sử mua hàng</>} style={{ marginBottom: 24 }}>
                <Table
                    columns={orderColumns}
                    dataSource={fakeData.orderHistory}
                    rowKey="orderId"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default UserDetailPage;
