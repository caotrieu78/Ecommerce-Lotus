import React, { useEffect, useState } from 'react';
import {
    Table, Avatar, Button, Modal, Tag, Typography, Space, message, Image, Input, Tabs, Divider
} from 'antd';
import {
    ExclamationCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
    DownloadOutlined,
    FilterOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../constants/paths';

import UserService from '../../../services/userService';
import UserModal from './UserModal';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Search } = Input;

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAll();
            const customers = data.filter(user => user.RoleID === 3);
            setUsers(customers);
        } catch {
            message.error('Lỗi khi tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (user) => {
        confirm({
            title: `Bạn có chắc chắn muốn xoá "${user.FullName}"?`,
            icon: <ExclamationCircleOutlined />,
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: async () => {
                try {
                    await UserService.delete(user.UserID);
                    setUsers(prev => prev.filter(u => u.UserID !== user.UserID));
                    message.success('Đã xoá khách hàng');
                } catch {
                    message.error('Xoá thất bại');
                }
            }
        });
    };

    const handleUpdate = (user) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const res = await UserService.update(editUser.UserID, formData);
            setUsers(prev =>
                prev.map(u => (u.UserID === editUser.UserID ? res.user : u))
            );
            message.success('Cập nhật thành công');
            setEditUser(null);
            setShowModal(false);
        } catch {
            message.error('Lỗi khi cập nhật');
        }
    };

    const filteredUsers = users.filter(u =>
        u.FullName.toLowerCase().includes(searchValue.toLowerCase()) ||
        u.Email.toLowerCase().includes(searchValue.toLowerCase())
    );

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'Avatar',
            render: (url) => (
                <Avatar
                    size={64}
                    src={url || 'https://via.placeholder.com/80?text=Avatar'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPreviewImage(url)}
                />
            )
        },
        {
            title: 'Họ tên',
            dataIndex: 'FullName',
            render: text => <strong>{text}</strong>
        },
        {
            title: 'Email',
            dataIndex: 'Email'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'IsActive',
            render: (isActive) =>
                isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khoá</Tag>
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(PATHS.USER_DETAIL(record.UserID))}
                    />
                    <Button icon={<EditOutlined />} onClick={() => handleUpdate(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)} />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: '#fff' }}>
            <Title level={3}>Danh sách khách hàng</Title>

            <Tabs defaultActiveKey="all" style={{ marginBottom: 16 }}>
                <Tabs.TabPane tab="Tất cả khách hàng" key="all" />
            </Tabs>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
            }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                    <Search
                        placeholder="Tìm kiếm theo tên, số điện thoại và email khách hàng"
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ minWidth: 300, flex: 1 }}
                        allowClear
                    />
                    <Button icon={<FilterOutlined />}>Bộ lọc</Button>
                    <Text type="secondary">Có <strong>{filteredUsers.length}</strong> khách hàng</Text>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <Button icon={<DownloadOutlined />}>Xuất dữ liệu</Button>
                    <Button icon={<UploadOutlined />}>Nhập dữ liệu</Button>
                    <Button type="primary" icon={<PlusOutlined />}>Tạo khách hàng</Button>
                </div>
            </div>

            <Divider />

            <Table
                rowKey="UserID"
                columns={columns}
                dataSource={filteredUsers}
                loading={loading}
                pagination={{ pageSize: 6 }}
                bordered
            />

            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
            >
                <Image src={previewImage} width="100%" />
            </Modal>

            {showModal && (
                <UserModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditUser(null);
                    }}
                    onSubmit={handleSubmit}
                    initialData={editUser}
                />
            )}
        </div>
    );
};

export default UserPage;
