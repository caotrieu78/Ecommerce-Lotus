import React from "react";
import { Typography } from "antd";

const Packing = () => {
    return (
        <div style={{ padding: 24 }}>
            <Typography.Title level={3}>Đóng gói hàng hoá</Typography.Title>
            <Typography.Paragraph>
                Danh sách các đơn hàng cần đóng gói trước khi giao.
            </Typography.Paragraph>
            <Typography.Paragraph>
                Chúc năng đang được xử lý
            </Typography.Paragraph>
        </div>
    );
};

export default Packing;
