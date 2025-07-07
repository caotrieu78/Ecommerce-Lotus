import React, { useEffect, useState } from "react";
import {
    Typography,
    Card,
    Table,
    Button,
    Space,
    Tag,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    message,
    Popconfirm,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CouponService from "../../../services/CouponService";

const { Title } = Typography;
const { Option } = Select;

const PromotionPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await CouponService.getAll();
            setCoupons(data);
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleOpenModal = (coupon = null) => {
        setEditingCoupon(coupon);
        if (coupon) {
            form.setFieldsValue({
                ...coupon,
                ExpirationDate: dayjs(coupon.ExpirationDate),
            });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCoupon(null);
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        const formatted = {
            ...values,
            ExpirationDate: values.ExpirationDate.toISOString(),
        };

        try {
            if (editingCoupon) {
                await CouponService.update(editingCoupon.CouponID, formatted);
                message.success("Cập nhật mã thành công");
            } else {
                await CouponService.create(formatted);
                message.success("Tạo mã giảm giá thành công");
            }
            fetchCoupons();
            handleCloseModal();
        } catch (err) {
            message.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await CouponService.remove(id);
            message.success("Xoá mã thành công");
            fetchCoupons();
        } catch (err) {
            message.error(err.message);
        }
    };

    const columns = [
        {
            title: "Mã",
            dataIndex: "Code",
            key: "Code",
        },
        {
            title: "Loại",
            dataIndex: "DiscountType",
            key: "DiscountType",
            render: (type) =>
                type === "percentage" ? "Phần trăm" : "Cố định",
        },
        {
            title: "Giá trị",
            dataIndex: "DiscountValue",
            key: "DiscountValue",
            render: (value, record) =>
                record.DiscountType === "percentage"
                    ? `${value}%`
                    : `${value.toLocaleString()} ₫`,
        },
        {
            title: "Tối thiểu",
            dataIndex: "MinOrderValue",
            key: "MinOrderValue",
            render: (value) => `${value.toLocaleString()} ₫`,
        },
        {
            title: "Hạn dùng",
            dataIndex: "ExpirationDate",
            key: "ExpirationDate",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Trạng thái",
            dataIndex: "IsActive",
            key: "IsActive",
            render: (active) =>
                active ? (
                    <Tag color="green">Đang dùng</Tag>
                ) : (
                    <Tag color="red">Tắt</Tag>
                ),
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="Xác nhận xoá mã?"
                        onConfirm={() => handleDelete(record.CouponID)}
                        okText="Xoá"
                        cancelText="Huỷ"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Quản lý khuyến mãi</Title>

            <Card
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal()}
                    >
                        Tạo mã giảm giá
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={coupons}
                    rowKey="CouponID"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                    bordered
                />
            </Card>

            <Modal
                open={isModalOpen}
                title={editingCoupon ? "Cập nhật mã" : "Tạo mã giảm giá"}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
                okText={editingCoupon ? "Cập nhật" : "Tạo mới"}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Mã giảm giá"
                        name="Code"
                        rules={[{ required: true, message: "Nhập mã" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Loại giảm"
                        name="DiscountType"
                        rules={[{ required: true, message: "Chọn loại giảm" }]}
                    >
                        <Select>
                            <Option value="percentage">Phần trăm (%)</Option>
                            <Option value="fixed">Số tiền cố định</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Giá trị giảm"
                        name="DiscountValue"
                        rules={[{ required: true, type: "number", min: 0.01 }]}
                    >
                        <InputNumber
                            min={0.01}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá trị đơn tối thiểu"
                        name="MinOrderValue"
                        rules={[{ required: true, type: "number", min: 0 }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Hạn sử dụng"
                        name="ExpirationDate"
                        rules={[{ required: true, message: "Chọn ngày" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Kích hoạt"
                        name="IsActive"
                        valuePropName="checked"
                    >
                        <Select>
                            <Option value={true}>Đang dùng</Option>
                            <Option value={false}>Tắt</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PromotionPage;
