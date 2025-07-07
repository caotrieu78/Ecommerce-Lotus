// ProductFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Form, Input, Select, Button, Upload, Row, Col, Typography, Spin, message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import CategoryService from '../../../services/categoryService';
import ProductService from '../../../services/ProductService';
import SellerService from '../../../services/SellerService';
import ProductVariantsForm from './ProductVariantsForm';

const { Title } = Typography;
const { Option } = Select;

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [variants, setVariants] = useState([]);

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch {
            message.error('Không thể tải danh mục');
        }
    };

    const fetchSellers = async () => {
        try {
            const data = await SellerService.getAll();
            setSellers(data);
        } catch {
            setSellers([]);
        }
    };

    const fetchProduct = async (productId) => {
        try {
            const data = await ProductService.getById(productId);
            setInitialData(data);
            form.setFieldsValue({
                ProductName: data.ProductName,
                Description: data.Description,
                Gender: data.Gender,
                CategoryID: data.CategoryID,
                Price: data.Price,
                SellerID: data.SellerID,
            });
            setVariants(data.variants || []);
        } catch {
            message.error('Không thể tải sản phẩm');
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSellers();
        if (id) {
            setLoading(true);
            fetchProduct(id).finally(() => setLoading(false));
        }
    }, [id]);

    const handleFinish = async (values) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'Thumbnail') {
                if (Array.isArray(value) && value.length > 0 && value[0].originFileObj) {
                    formData.append('Thumbnail', value[0].originFileObj);
                }
            } else {
                formData.append(key, value);
            }
        });

        // Append variant data
        variants.forEach((variant, index) => {
            formData.append(`variants[${index}][SizeID]`, variant.SizeID);
            formData.append(`variants[${index}][ColorID]`, variant.ColorID);
            formData.append(`variants[${index}][Price]`, variant.Price);
            formData.append(`variants[${index}][StockQuantity]`, variant.StockQuantity);
            if (variant.Image instanceof File) {
                formData.append(`variants[${index}][Image]`, variant.Image);
            }
        });

        try {
            if (id) {
                await ProductService.update(id, formData);
                message.success('Cập nhật thành công');
            } else {
                await ProductService.create(formData);
                message.success('Tạo sản phẩm thành công');
            }
            navigate(-1);
        } catch (err) {
            message.error(`Lưu sản phẩm thất bại: ${err?.response?.data?.message || ''}`);
            console.error("Lỗi tạo/cập nhật sản phẩm:", err.response?.data);
        }
    };

    return (
        <div style={{ width: '100%', padding: '24px 40px' }}>
            <Title level={3}>{id ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}</Title>

            {loading ? (
                <Spin />
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{
                        background: '#fff',
                        padding: 24,
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        width: '100%',
                    }}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="SellerID"
                                label="Nhãn hàng"
                                rules={[{ required: true, message: 'Vui lòng chọn nhãn hàng' }]}
                            >
                                <Select placeholder="Chọn nhãn hàng">
                                    {sellers.map((s) => (
                                        <Option key={s.SellerID} value={s.SellerID}>
                                            {s.StoreName || `Seller ${s.SellerID}`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Gender" label="Giới tính">
                                <Select allowClear placeholder="Chọn giới tính">
                                    <Option value="Male">Nam</Option>
                                    <Option value="Female">Nữ</Option>
                                    <Option value="Unisex">Unisex</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="ProductName"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="CategoryID"
                                label="Danh mục"
                                rules={[{ required: true, message: 'Chọn danh mục' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    {categories.map((cat) => (
                                        <Option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="Price"
                                label="Giá (VNĐ)"
                                rules={[{ required: true, message: 'Nhập giá sản phẩm' }]}
                            >
                                <Input type="number" min={0} placeholder="VD: 100000" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="Thumbnail"
                                label="Ảnh sản phẩm"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e?.fileList}
                            >
                                <Upload
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    listType="picture-card"
                                    defaultFileList={
                                        initialData?.ThumbnailURL
                                            ? [
                                                {
                                                    uid: '-1',
                                                    name: 'current.jpg',
                                                    status: 'done',
                                                    url: initialData.ThumbnailURL,
                                                },
                                            ]
                                            : []
                                    }
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="Description" label="Mô tả">
                        <Input.TextArea rows={4} placeholder="Thêm mô tả sản phẩm (không bắt buộc)" />
                    </Form.Item>

                    <ProductVariantsForm value={variants} onChange={setVariants} />

                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button style={{ marginRight: 8 }} onClick={() => navigate(-1)}>
                            Huỷ
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {id ? 'Cập nhật' : 'Tạo'}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default ProductFormPage;
