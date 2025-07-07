import React from "react";
import { Button as AntButton } from "antd";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Typography, Button as MUIButton } from '@mui/material';

const DraftOrders = () => {
    return (
        <Box
            sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "60vh",
                justifyContent: "center",
                backgroundColor: "#f5f7fa",
                borderRadius: 2
            }}
        >


            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Đơn hàng nháp
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={4}>
                Quản lý những đơn hàng được tạo theo yêu cầu của khách hàng nhưng chưa hoàn tất đặt hàng.
            </Typography>

            <AntButton
                type="primary"
                icon={<AddCircleOutlineIcon />}
                size="large"
                style={{ marginBottom: 16 }}
            >
                Tạo đơn
            </AntButton>

            <MUIButton
                variant="outlined"
                startIcon={<HelpOutlineIcon />}
                size="medium"
            >
                Trợ giúp về Đơn hàng nháp
            </MUIButton>
        </Box>
    );
};

export default DraftOrders;
