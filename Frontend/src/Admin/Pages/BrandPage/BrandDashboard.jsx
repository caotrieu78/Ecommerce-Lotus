import React, { useEffect, useState } from "react";
import {
    Typography,
    Input,
    Select,
    Form,
    Button,
    Alert,
    Spin,
    Card,
    Modal,
    Table,
    Tag,
} from "antd";
import { Box } from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";
import UserService from "../../../services/userService";
import SellerService from "../../../services/SellerService";

const { Option } = Select;

const BrandDashboard = () => {
    const [sellers, setSellers] = useState([]);
    const [brands, setBrands] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await UserService.getAll();
                const onlySellers = users.filter((u) => u.RoleID === 2);
                setSellers(onlySellers);

                const brandList = await SellerService.getAll();
                setBrands(brandList);
            } catch (err) {
                console.error(err);
                setError("Không thể tải dữ liệu.");
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload = {
                ...values,
                Logo: values.Logo,
            };

            await SellerService.createInfo(payload);
            setSuccess("✅ Tạo nhãn hàng thành công!");
            form.resetFields();
            setLogoPreview("");
            setModalOpen(false);

            const updated = await SellerService.getAll();
            setBrands(updated);
        } catch (err) {
            console.error(err);
            setError(err.message || "❌ Tạo nhãn hàng thất bại.");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Logo",
            dataIndex: "LogoURL",
            render: (url) =>
                url ? (
                    <img src={url} alt="Logo" style={{ height: 40, objectFit: "contain" }} />
                ) : (
                    <Tag color="default">Không có</Tag>
                ),
        },
        {
            title: "Tên nhãn hàng",
            dataIndex: "StoreName",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Mô tả",
            dataIndex: "Description",
        },
        {
            title: "Người bán",
            dataIndex: "Seller",
            render: (seller) =>
                <span>{seller?.FullName || seller?.Username || "Không rõ"}</span>,
        },
        {
            title: "Email",
            dataIndex: "Email",
        },
        {
            title: "Số điện thoại",
            dataIndex: "Phone",
        },
        {
            title: "Địa chỉ",
            dataIndex: "Address",
        },
    ];

    return (
        <Box className="p-5">
            <Typography.Title level={3}>Quản lý nhãn hàng</Typography.Title>

            <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setModalOpen(true)}
                className="mb-4"
            >
                Thêm nhãn hàng
            </Button>

            <Table
                dataSource={brands}
                rowKey="SellerID"
                columns={columns}
                bordered
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title="Tạo nhãn hàng"
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    form.resetFields();
                    setLogoPreview("");
                }}
                footer={null}
                width={600}
            >
                {error && <Alert message={error} type="error" showIcon className="mb-4" />}
                {success && <Alert message={success} type="success" showIcon className="mb-4" />}

                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item
                        label="Chọn Seller"
                        name="SellerID"
                        rules={[{ required: true, message: "Chọn người dùng!" }]}
                    >
                        <Select placeholder="Chọn seller">
                            {sellers.map((seller) => (
                                <Option key={seller.UserID} value={seller.UserID}>
                                    {seller.FullName || seller.Username} ({seller.Email})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Tên nhãn hàng"
                        name="StoreName"
                        rules={[{ required: true, message: "Nhập tên nhãn hàng" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Logo"
                        name="Logo"
                        valuePropName="file"
                        getValueFromEvent={(e) => {
                            const file = e?.target?.files?.[0];
                            if (file) {
                                setLogoPreview(URL.createObjectURL(file));
                            }
                            return file;
                        }}
                    >
                        <Input type="file" accept="image/*" />
                    </Form.Item>

                    {logoPreview && (
                        <div className="text-center mb-3">
                            <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="max-h-20 mx-auto"
                            />
                        </div>
                    )}

                    <Form.Item label="Địa chỉ" name="Address">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" name="Phone">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Email" name="Email">
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={loading} block>
                            {loading ? <Spin /> : "Tạo nhãn hàng"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Box>
    );
};

export default BrandDashboard;
