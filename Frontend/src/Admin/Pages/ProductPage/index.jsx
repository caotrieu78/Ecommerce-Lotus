import React, { useEffect, useState } from 'react';
import {
    Table, Button, Space, Typography, Modal, Image, Tag, Input, Dropdown, Menu
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import ProductVariantService from '../../../services/productVariantService';

import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage';
import { PATHS } from '../../../constants/paths';
import ProductService from '../../../services/productService';

const { Title } = Typography;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const productList = await ProductService.getAll();

            const stockPromises = productList.map(product =>
                ProductVariantService.getTotalStock(product.ProductID)
                    .then((res) => ({
                        ProductID: product.ProductID,
                        TotalStock: res.TotalStock
                    }))
                    .catch(() => ({
                        ProductID: product.ProductID,
                        TotalStock: 0
                    }))
            );

            const stockResults = await Promise.all(stockPromises);

            const enriched = productList.map(product => {
                const stock = stockResults.find(s => s.ProductID === product.ProductID);
                return {
                    ...product,
                    totalStock: stock?.TotalStock || 0
                };
            });

            setProducts(enriched);
        } catch {
            showToast('Lỗi khi tải sản phẩm', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = () => {
        navigate(PATHS.PRODUCT_CREATE);
    };

    const handleCreateCombo = () => {
        navigate('/create-combo'); // thay đổi nếu path khác
    };

    const handleEdit = (product) => {
        navigate(PATHS.PRODUCT_EDIT(product.ProductID));
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await ProductService.delete(productToDelete.ProductID);
            setShowConfirm(false);
            fetchProducts();
            showToast('Đã xoá sản phẩm');
        } catch {
            showToast('Lỗi khi xoá sản phẩm', 'error');
        }
    };

    const handleImport = () => {
        // TODO: xử lý nhập file Excel
        showToast("Tính năng nhập dữ liệu chưa được triển khai", "info");
    };

    const handleExport = () => {
        // TODO: xử lý xuất dữ liệu
        showToast("Tính năng xuất dữ liệu chưa được triển khai", "info");
    };

    const filteredProducts = products.filter(p =>
        p.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'ThumbnailURL',
            width: 100,
            render: (url) => (
                <Image
                    width={60}
                    height={60}
                    src={url || 'https://via.placeholder.com/80?text=No+Image'}
                    preview={false}
                    style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                    onClick={() => url && setPreviewImage(url)}
                />
            )
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ProductName',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Tồn kho',
            dataIndex: 'totalStock',
            render: (total) => `${total} sản phẩm`
        },
        {
            title: 'Loại',
            dataIndex: 'category',
            render: (category) => category?.CategoryName || 'Không rõ'
        },
        {
            title: 'Nhãn hàng',
            dataIndex: 'seller',
            render: (seller) => (
                <Tag color="blue">{seller?.FullName || seller?.BrandName || 'Không rõ'}</Tag>
            )
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => confirmDelete(record)} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>Danh sách sản phẩm</Title>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="import" icon={<UploadOutlined />} onClick={handleImport}>
                                    Nhập dữ liệu
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>Nhập dữ liệu</Button>
                    </Dropdown>

                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="export" icon={<DownloadOutlined />} onClick={handleExport}>
                                    Xuất dữ liệu
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>Xuất dữ liệu</Button>
                    </Dropdown>

                    <Button icon={<PlusOutlined />} onClick={handleCreateCombo}>
                        Tạo combo
                    </Button>

                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Tạo sản phẩm
                    </Button>
                </div>

                <Input.Search
                    placeholder="Tìm kiếm"
                    allowClear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: 300 }}
                />
            </div>

            <Table
                rowKey="ProductID"
                dataSource={filteredProducts}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
            />

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá sản phẩm"
                message={`Bạn có chắc chắn muốn xoá sản phẩm "${productToDelete?.ProductName}"?`}
                onConfirm={handleDeleteConfirmed}
                onClose={() => setShowConfirm(false)}
            />

            {toast.show && (
                <ToastMessage
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                width={600}
            >
                <Image src={previewImage} width="100%" />
            </Modal>
        </div>
    );
};

export default ProductPage;
