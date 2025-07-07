import React, { useState } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
    Typography,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaClipboardList,
    FaChevronDown,
    FaChevronUp,
    FaList,
    FaBox,
    FaThLarge,
    FaUsers,
    FaStore,
    FaComments,
    FaChartBar,
    FaTruck,
    FaAngleLeft,
    FaAngleRight,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";
import { PATHS } from "../../constants/paths";

const drawerWidth = 240;
const collapsedWidth = 80;

const Sidebar = ({ open, onToggle }) => {
    const location = useLocation();
    const path = location.pathname;
    const [openMenu, setOpenMenu] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const toggleMenu = (menu) => {
        if (collapsed) return;
        setOpenMenu((prev) => (prev === menu ? null : menu));
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
        if (!collapsed) {
            setOpenMenu(null);
        }
    };

    const isActive = (target) => path.startsWith(target);

    const mainLinkStyle = (active) => ({
        backgroundColor: active ? "rgba(255, 255, 255, 0.2)" : "transparent",
        color: "#fff",
        borderRadius: "12px",
        margin: "4px 16px",
        paddingLeft: collapsed ? "16px" : "20px",
        paddingRight: "16px",
        paddingTop: "12px",
        paddingBottom: "12px",
        fontWeight: active ? 600 : 400,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
        "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: active
                ? "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)"
                : "transparent",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            zIndex: -1,
        },
        "&:hover": {
            backgroundColor: active ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)",
            transform: "translateX(4px)",
            boxShadow: active
                ? "0 8px 25px rgba(196, 3, 128, 0.25)"
                : "0 4px 15px rgba(196, 3, 128, 0.15)",
        },
        "&:active": {
            transform: "translateX(2px)",
        },
    });

    const subLinkStyle = (active) => ({
        backgroundColor: active ? "rgba(255, 255, 255, 0.15)" : "transparent",
        color: active ? "#fff" : "rgba(255, 255, 255, 0.85)",
        borderRadius: "8px",
        margin: "2px 16px 2px 32px",
        paddingLeft: "20px",
        paddingRight: "16px",
        paddingTop: "8px",
        paddingBottom: "8px",
        fontWeight: active ? 500 : 400,
        fontSize: "0.875rem",
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "#fff",
            transform: "translateX(4px)",
        },
    });

    const iconStyle = (active) => ({
        color: "#fff",
        minWidth: collapsed ? "auto" : "40px",
        fontSize: "1.2rem",
        transition: "all 0.3s ease",
        opacity: active ? 1 : 0.8,
    });

    const menuItems = [
        {
            id: "dashboard",
            label: "Tổng quan",
            icon: <FaTachometerAlt />,
            path: PATHS.DASHBOARD,
            exact: true,
        },
        {
            id: "orders",
            label: "Đơn hàng",
            icon: <FaClipboardList />,
            hasSubmenu: true,
            checkPath: "/dashboard/orders",
            submenu: [
                { label: "Tất cả đơn hàng", path: PATHS.ORDER_ALL },
                { label: "Đơn hàng nháp", path: PATHS.ORDER_DRAFT },
                { label: "Chưa hoàn tất", path: PATHS.ORDER_PENDING },
                { label: "Giao hàng hàng loạt", path: PATHS.ORDER_BULK_SHIP },
            ],
        },
        {
            id: "shipping",
            label: "Vận chuyển",
            icon: <FaTruck />,
            hasSubmenu: true,
            checkPath: "/dashboard/shipping",
            submenu: [
                { label: "Tổng quan", path: PATHS.SHIPPING_OVERVIEW },
                { label: "Vận chuyển", path: PATHS.SHIPPING_LIST },
                { label: "Quản lý thu hộ", path: PATHS.SHIPPING_COD },
                { label: "Đóng gói", path: PATHS.SHIPPING_PACKING },
                { label: "Biên bản bàn giao", path: PATHS.SHIPPING_HANDOVER },
                { label: "Biên bản hoàn hàng", path: PATHS.SHIPPING_RETURN },
            ],
        },
        {
            id: "product",
            label: "Sản phẩm",
            icon: <FaBox />,
            hasSubmenu: true,
            checkPath: ["/dashboard/product", "/dashboard/category"],
            submenu: [
                { label: "Danh mục", path: PATHS.CATEGORY_DASHBOARD },
                { label: "Tất cả sản phẩm", path: PATHS.PRODUCT_DASHBOARD },
                { label: "Nhóm sản phẩm", path: PATHS.PRODUCT_GROUPS },
                { label: "Bảng giá", path: PATHS.PRICING_TABLE },
                { label: "Tồn kho", path: PATHS.PRODUCT_INVENTORY },
            ],
        },
        {
            id: "customers",
            label: "Khách hàng",
            icon: <FaUsers />,
            path: PATHS.USER_DASHBOARD,
            exact: true,
        },
        {
            id: "promotions",
            label: "Khuyến mãi",
            icon: <FaComments />,
            path: PATHS.PROMOTION_DASHBOARD,
            exact: true,
        },
        {
            id: "report",
            label: "Báo cáo",
            icon: <FaChartBar />,
            hasSubmenu: true,
            checkPath: "/dashboard/report",
            submenu: [
                { label: "Bảng phân tích", path: PATHS.REPORT_ANALYTICS },
                { label: "Danh sách báo cáo", path: PATHS.REPORT_DASHBOARD },
            ],
        },
    ];

    const checkIsActive = (item) => {
        if (item.exact) {
            return path === item.path;
        }
        if (Array.isArray(item.checkPath)) {
            return item.checkPath.some(p => path.startsWith(p));
        }
        return path.startsWith(item.checkPath);
    };

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                width: collapsed ? collapsedWidth : drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: collapsed ? collapsedWidth : drawerWidth,
                    background: "linear-gradient(135deg, #c40380 0%, #e64a94 50%, #ff6bb5 100%)",
                    color: "#fff",
                    borderRight: 0,
                    boxShadow: "0 4px 20px rgba(196, 3, 128, 0.3)",
                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflowX: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
                        pointerEvents: "none",
                        zIndex: 0,
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: collapsed ? "center" : "space-between",
                    alignItems: "center",
                    padding: collapsed ? "16px 8px" : "20px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(20px)",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {!collapsed && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                            src="/images/lotus-logo.png"
                            alt="Lotus Logo"
                            style={{ height: 32, width: 32 }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Lotus Admin
                        </Typography>
                    </Box>
                )}

                {collapsed && (
                    <img
                        src="/images/lotus-logo.png"
                        alt="Lotus Logo"
                        style={{ height: 28, width: 28 }}
                    />
                )}

                {!collapsed && (
                    <Tooltip title="Thu gọn sidebar" arrow>
                        <IconButton
                            onClick={toggleCollapse}
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                padding: "4px",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "#fff",
                                },
                            }}
                        >
                            <FaAngleLeft />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Expand Button for Collapsed State */}
            {collapsed && (
                <Box sx={{ padding: "8px", textAlign: "center" }}>
                    <Tooltip title="Mở rộng sidebar" arrow placement="right">
                        <IconButton
                            onClick={toggleCollapse}
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "#fff",
                                },
                            }}
                        >
                            <FaAngleRight />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Navigation */}
            <List
                sx={{
                    padding: "16px 0",
                    flex: 1,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(255,255,255,0.4)",
                        borderRadius: "6px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "rgba(255,255,255,0.6)",
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.4) transparent",
                }}
            >

                {menuItems.map((item) => (
                    <React.Fragment key={item.id}>
                        {item.hasSubmenu ? (
                            <>
                                <Tooltip
                                    title={collapsed ? item.label : ""}
                                    arrow
                                    placement="right"
                                    disableHoverListener={!collapsed}
                                >
                                    <ListItemButton
                                        onClick={() => toggleMenu(item.id)}
                                        sx={mainLinkStyle(checkIsActive(item))}
                                    >
                                        <ListItemIcon sx={iconStyle(checkIsActive(item))}>
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <>
                                                <ListItemText
                                                    primary={item.label}
                                                    primaryTypographyProps={{
                                                        fontSize: "0.95rem",
                                                        fontWeight: checkIsActive(item) ? 600 : 400,
                                                    }}
                                                />
                                                {openMenu === item.id ? (
                                                    <FaChevronUp size={12} />
                                                ) : (
                                                    <FaChevronDown size={12} />
                                                )}
                                            </>
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                                {!collapsed && (
                                    <Collapse in={openMenu === item.id} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.submenu.map((subItem) => (
                                                <NavLink
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    <ListItemButton
                                                        sx={subLinkStyle(path === subItem.path)}
                                                    >
                                                        <ListItemText
                                                            primary={subItem.label}
                                                            primaryTypographyProps={{
                                                                fontSize: "0.85rem",
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                </NavLink>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </>
                        ) : (
                            <Tooltip
                                title={collapsed ? item.label : ""}
                                arrow
                                placement="right"
                                disableHoverListener={!collapsed}
                            >
                                <NavLink to={item.path} style={{ textDecoration: "none" }}>
                                    <ListItemButton sx={mainLinkStyle(checkIsActive(item))}>
                                        <ListItemIcon sx={iconStyle(checkIsActive(item))}>
                                            {item.icon}
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    fontSize: "0.95rem",
                                                    fontWeight: checkIsActive(item) ? 600 : 400,
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </NavLink>
                            </Tooltip>
                        )}
                    </React.Fragment>
                ))}
            </List>

            {/* Footer */}
            {!collapsed && (
                <Box sx={{
                    padding: "16px 24px",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    zIndex: 1,
                }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Cài đặt" arrow>
                            <IconButton
                                sx={{
                                    color: "rgba(255,255,255,0.8)",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "10px",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <FaCog />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Đăng xuất" arrow>
                            <IconButton
                                sx={{
                                    color: "rgba(255,255,255,0.8)",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "10px",
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: "#fff",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                                <FaSignOutAlt />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

            )}

        </Drawer>

    );
};

export default Sidebar;