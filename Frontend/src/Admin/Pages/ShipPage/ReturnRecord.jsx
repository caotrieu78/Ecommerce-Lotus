import React from "react";
import { Typography } from "antd";

const ReturnRecord = () => {
    return (
        <div style={{ padding: 24 }}>
            <Typography.Title level={3}>Biên bản hoàn hàng</Typography.Title>
            <Typography.Paragraph>
                Theo dõi biên bản hoàn trả hàng từ khách.
            </Typography.Paragraph>
            <Typography.Paragraph>
                Chúc năng đang được xử lý
            </Typography.Paragraph>
        </div>
    );
};

export default ReturnRecord;
