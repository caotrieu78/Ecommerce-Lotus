import React from "react";
import { Typography } from "antd";

const ShippingList = () => {
    return (
        <div style={{ padding: 24 }}>
            <Typography.Title level={3}>Danh sách vận chuyển</Typography.Title>
            <Typography.Paragraph>
                Hiển thị danh sách các đơn hàng đang được vận chuyển.
            </Typography.Paragraph>
            <Typography.Paragraph>
                Chúc năng đang được xử lý
            </Typography.Paragraph>
        </div>
    );
};

export default ShippingList;
