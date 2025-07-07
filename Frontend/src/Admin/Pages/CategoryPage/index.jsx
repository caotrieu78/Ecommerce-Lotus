import React, { useEffect, useState } from "react";
import {
    Button,
    Input,
    Table,
    Space,
    message,
    Typography
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    CloseOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from "@ant-design/icons";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";
import CategoryService from "../../../services/categoryService";

const { Title } = Typography;

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (msg, type = "success") => {
        message[type](msg);
    };

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch {
            showToast("Lỗi khi tải danh sách loại sản phẩm", "error");
        }
    };

    const handleCreate = async () => {
        if (newCategory.trim()) {
            try {
                await CategoryService.create({ CategoryName: newCategory });
                setNewCategory("");
                fetchCategories();
                showToast("Thêm loại thành công");
            } catch {
                showToast("Lỗi khi thêm loại", "error");
            }
        }
    };

    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await CategoryService.delete(categoryToDelete.id);
            fetchCategories();
            showToast("Đã xoá loại thành công");
        } catch {
            showToast("Lỗi khi xoá loại", "error");
        } finally {
            setShowConfirm(false);
        }
    };

    const handleUpdate = async () => {
        if (editValue.trim()) {
            try {
                await CategoryService.update(editingId, { CategoryName: editValue });
                setEditingId(null);
                setEditValue("");
                fetchCategories();
                showToast("Cập nhật loại thành công");
            } catch {
                showToast("Lỗi khi cập nhật", "error");
            }
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedRowKeys.map(id => CategoryService.delete(id)));
            setSelectedRowKeys([]);
            fetchCategories();
            showToast("Đã xoá các loại đã chọn");
        } catch {
            showToast("Lỗi khi xoá các loại", "error");
        }
    };

    const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) =>
        sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const columns = [
        {
            title: "Tên loại",
            dataIndex: "name",
            render: (text, record) => (
                editingId === record.id ? (
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onPressEnter={handleUpdate}
                    />
                ) : (
                    <span>{text}</span>
                )
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                editingId === record.id ? (
                    <Space>
                        <Button icon={<SaveOutlined />} onClick={handleUpdate} type="primary">
                            Lưu
                        </Button>
                        <Button icon={<CloseOutlined />} onClick={() => setEditingId(null)}>
                            Huỷ
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditingId(record.id);
                                setEditValue(record.name);
                            }}
                        >
                            Sửa
                        </Button>
                        <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(record)}>
                            Xoá
                        </Button>
                    </Space>
                )
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: "#fff" }}>
            <Title level={3}>Quản lý loại sản phẩm</Title>

            <Space style={{ marginBottom: 16 }} wrap>
                <Input
                    placeholder="Tìm kiếm loại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    prefix={<SearchOutlined />}
                />
                <Button
                    icon={sortOrder === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                    Sắp xếp
                </Button>
                <Input
                    placeholder="Thêm loại mới"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onPressEnter={handleCreate}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Thêm
                </Button>
                {selectedRowKeys.length > 0 && (
                    <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
                        Xoá đã chọn
                    </Button>
                )}
            </Space>

            <Table
                rowKey="id"
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys
                }}
                columns={columns}
                dataSource={sorted}
                pagination={{ pageSize: 5 }}
            />

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá"
                message={`Bạn có chắc muốn xoá loại "${categoryToDelete?.name}"?`}
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
        </div>
    );
};

export default CategoryPage;
