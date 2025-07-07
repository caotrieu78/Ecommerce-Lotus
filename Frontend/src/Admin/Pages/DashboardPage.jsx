import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    useTheme,
    Chip,
    Divider
} from "@mui/material";
import {
    ShoppingCart,
    People,
    AttachMoney,
    Inventory,
    LocalShipping,
    Cancel,
    Payment,
    TrendingUp
} from "@mui/icons-material";
import { Card } from "antd";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const DashboardPage = () => {
    const theme = useTheme();

    const [stats, setStats] = useState({
        revenue: 123456789,
        orders: 248,
        users: 1024,
        products: 540
    });

    const [orderData, setOrderData] = useState({
        labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
        datasets: [
            {
                label: "Đơn hàng",
                data: [30, 45, 60, 40, 90, 75, 100],
                borderColor: "#00c4ff",
                backgroundColor: "rgba(0, 196, 255, 0.2)",
                fill: true,
                tension: 0.4
            }
        ]
    });

    const [todayStats, setTodayStats] = useState({
        revenue: 0,
        orders: 0
    });

    const [orderStatus, setOrderStatus] = useState({
        unpaid: 82,
        undelivered: 82,
        shipping: 0,
        cancelled: 0
    });

    const recentOrders = [
        { id: 10001, total: 100000 },
        { id: 10002, total: 110000 },
        { id: 10003, total: 120000 },
        { id: 10004, total: 130000 },
        { id: 10005, total: 140000 }
    ];

    const statsConfig = [
        {
            label: "Tổng doanh thu",
            value: `${stats.revenue.toLocaleString()} ₫`,
            icon: <AttachMoney />,
            bg: "#e0f7fa"
        },
        {
            label: "Tổng đơn hàng",
            value: stats.orders,
            icon: <ShoppingCart />,
            bg: "#fff3e0"
        },
        {
            label: "Người dùng",
            value: stats.users,
            icon: <People />,
            bg: "#ede7f6"
        },
        {
            label: "Sản phẩm",
            value: stats.products,
            icon: <Inventory />,
            bg: "#f1f8e9"
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Trang tổng quan
            </Typography>

            <Grid container spacing={3}>
                {statsConfig.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card bordered={false}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
                                <Avatar sx={{ bgcolor: item.bg, color: "#003366", width: 48, height: 48 }}>
                                    {item.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h6">{item.value}</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} md={8}>
                    <Card title="Thống kê đơn hàng theo tháng" bordered={false}>
                        <Line data={orderData} />
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card title="Đơn hàng gần đây" bordered={false}>
                        <Box sx={{ maxHeight: 280, overflowY: "auto" }}>
                            {recentOrders.map((order, i) => (
                                <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                                    <Typography>ĐH #{order.id}</Typography>
                                    <Typography color="green">{order.total.toLocaleString()} ₫</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card title="Kết quả kinh doanh hôm nay" bordered={false}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="textSecondary">Doanh thu</Typography>
                                <Typography variant="h6">{todayStats.revenue.toLocaleString()} ₫</Typography>
                                <a href="#">Xem báo cáo</a>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="textSecondary">Đơn hàng</Typography>
                                <Typography variant="h6">{todayStats.orders}</Typography>
                                <a href="#">Xem báo cáo</a>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card title="Trạng thái đơn hàng" bordered={false}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Chip icon={<Payment />} label={`${orderStatus.unpaid} chưa thanh toán`} />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<LocalShipping />} label={`${orderStatus.undelivered} chưa giao hàng`} />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<TrendingUp />} label={`${orderStatus.shipping} đang giao hàng`} />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<Cancel />} label={`${orderStatus.cancelled} huỷ đơn`} />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card title="Sản phẩm bán chạy" bordered={false}>
                        <Typography color="textSecondary">Không có sản phẩm bán chạy</Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
