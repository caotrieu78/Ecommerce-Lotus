import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Avatar,
    Menu,
    MenuItem,
    Box,
    Typography,
    Badge,
    Chip,
    Divider,
    ListItemIcon,
    ListItemText,
    Fade,
    Paper,
} from "@mui/material";
import {
    FaBars,
    FaSearch,
    FaBell,
    FaUser,
    FaSignOutAlt,
    FaCog,
    FaEnvelope,
    FaUserCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { PATHS } from "../../constants/paths";
import UserService from "../../services/userService";

const Topbar = ({ onToggleSidebar }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [user, setUser] = useState(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            const parsed = JSON.parse(localUser);
            if (parsed?.UserID) {
                UserService.getById(parsed.UserID).then(setUser).catch(() => setUser(parsed));
            } else {
                setUser(parsed);
            }
        }
    }, []);

    const handleLogout = async () => {
        setAnchorEl(null);
        await logout();
        navigate(PATHS.LOGIN);
    };

    const goToProfile = () => {
        setAnchorEl(null);
        navigate(PATHS.PROFILE_DASHBOARD);
    };

    const mockNotifications = [
        { id: 1, title: "Đơn hàng mới", message: "Có 5 đơn hàng mới cần xử lý", time: "5 phút trước" },
        { id: 2, title: "Tồn kho thấp", message: "Sản phẩm ABC sắp hết hàng", time: "1 giờ trước" },
        { id: 3, title: "Khuyến mãi", message: "Chương trình khuyến mãi sắp kết thúc", time: "2 giờ trước" },
    ];

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: 1201,
                background: "linear-gradient(135deg, #c40380 0%, #e64a94 50%, #ff6bb5 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 4px 20px rgba(196, 3, 128, 0.3)",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
                    pointerEvents: "none",
                },
            }}
        >
            <Toolbar sx={{ minHeight: "70px !important", padding: "0 24px" }}>
                {/* Menu Toggle */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onToggleSidebar}
                    sx={{
                        mr: 2,
                        padding: "12px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.2)",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <FaBars />
                </IconButton>

                {/* Logo */}
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                    <img
                        src="/images/logo copy.png"
                        alt="Logo"
                        style={{
                            height: 50,
                            maxWidth: 280,
                            objectFit: "contain",
                            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
                        }}
                    />
                </Box>

                {/* Search Bar */}
                <Box
                    sx={{
                        position: "relative",
                        mr: 3,
                        minWidth: 250,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            background: searchFocused
                                ? "rgba(255, 255, 255, 0.25)"
                                : "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "25px",
                            padding: "8px 16px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: searchFocused
                                ? "1px solid rgba(255, 255, 255, 0.4)"
                                : "1px solid rgba(255, 255, 255, 0.2)",
                            "&:hover": {
                                background: "rgba(255, 255, 255, 0.25)",
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        <FaSearch
                            style={{
                                color: "rgba(255, 255, 255, 0.7)",
                                marginRight: 12,
                                fontSize: "1rem"
                            }}
                        />
                        <InputBase
                            placeholder="Tìm kiếm đơn hàng, sản phẩm..."
                            sx={{
                                color: "#fff",
                                flex: 1,
                                fontSize: "0.9rem",
                                "& .MuiInputBase-input": {
                                    padding: "4px 0",
                                    "&::placeholder": {
                                        color: "rgba(255, 255, 255, 0.7)",
                                        opacity: 1,
                                    },
                                },
                            }}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </Paper>
                </Box>

                {/* Notifications */}
                <IconButton
                    color="inherit"
                    onClick={(e) => setNotificationAnchor(e.currentTarget)}
                    sx={{
                        mr: 2,
                        padding: "12px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.2)",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <Badge
                        badgeContent={mockNotifications.length}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                background: "linear-gradient(45deg, #ff4444, #ff6b6b)",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "0.75rem",
                            }
                        }}
                    >
                        <FaBell />
                    </Badge>
                </IconButton>

                {/* Notification Menu */}
                <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={() => setNotificationAnchor(null)}
                    TransitionComponent={Fade}
                    PaperProps={{
                        sx: {
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "16px",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            minWidth: 320,
                            maxWidth: 400,
                            mt: 1,
                        }
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                            Thông báo
                        </Typography>
                    </Box>
                    {mockNotifications.map((notification) => (
                        <MenuItem key={notification.id} sx={{ py: 1.5, px: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>
                                    {notification.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#999", mt: 0.5 }}>
                                    {notification.time}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Menu>

                {/* User Menu */}
                <Box sx={{ position: "relative" }}>
                    <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            p: 1,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                                background: "rgba(255, 255, 255, 0.2)",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <Avatar
                            src={user?.Avatar || "/images/admin-avatar.png"}
                            sx={{
                                width: 40,
                                height: 40,
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
                            }}
                        />
                    </IconButton>

                    {user && (
                        <Chip
                            label="Online"
                            size="small"
                            sx={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
                                color: "white",
                                fontSize: "0.7rem",
                                height: 20,
                                "& .MuiChip-label": {
                                    px: 1,
                                },
                            }}
                        />
                    )}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        TransitionComponent={Fade}
                        PaperProps={{
                            sx: {
                                background: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "16px",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                minWidth: 220,
                                mt: 1,
                            }
                        }}
                    >
                        {/* User Info */}
                        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                                {user?.FullName || "Quản trị viên"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                                {user?.Email || "admin@lotus.com"}
                            </Typography>
                        </Box>

                        {/* Menu Items */}
                        <MenuItem onClick={goToProfile} sx={{ py: 1.5, px: 2 }}>
                            <ListItemIcon>
                                <FaUserCircle style={{ color: "#666" }} />
                            </ListItemIcon>
                            <ListItemText primary="Thông tin cá nhân" />
                        </MenuItem>

                        <MenuItem sx={{ py: 1.5, px: 2 }}>
                            <ListItemIcon>
                                <FaCog style={{ color: "#666" }} />
                            </ListItemIcon>
                            <ListItemText primary="Cài đặt" />
                        </MenuItem>

                        <Divider sx={{ my: 1 }} />

                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                py: 1.5,
                                px: 2,
                                color: "#f44336",
                                "&:hover": {
                                    background: "rgba(244, 67, 54, 0.1)",
                                }
                            }}
                        >
                            <ListItemIcon>
                                <FaSignOutAlt style={{ color: "#f44336" }} />
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;