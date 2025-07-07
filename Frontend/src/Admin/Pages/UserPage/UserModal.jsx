import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Grid,
    Typography,
    Avatar,
} from '@mui/material';
import { FaEdit, FaPlus } from 'react-icons/fa';

const UserModal = ({ show, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        FullName: '',
        Email: '',
        IsActive: true,
        RoleID: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [existingAvatar, setExistingAvatar] = useState('');

    useEffect(() => {
        if (initialData) {
            setForm({
                FullName: initialData.FullName || '',
                Email: initialData.Email || '',
                IsActive: initialData.IsActive ?? true,
                RoleID: initialData.RoleID || '',
            });
            setExistingAvatar(initialData.Avatar || '');
            setAvatarFile(null);
        } else {
            setForm({
                FullName: '',
                Email: '',
                IsActive: true,
                RoleID: '',
            });
            setExistingAvatar('');
            setAvatarFile(null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('FullName', form.FullName);
        formData.append('Email', form.Email);
        formData.append('IsActive', form.IsActive ? '1' : '0');
        formData.append('RoleID', form.RoleID);
        if (avatarFile) {
            formData.append('Avatar', avatarFile);
        }
        onSubmit(formData);
    };

    return (
        <Dialog open={show} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h6" fontWeight={600} display="flex" alignItems="center" gap={1}>
                    {initialData ? (
                        <>
                            <FaEdit style={{ color: '#1976d2' }} /> Sửa người dùng
                        </>
                    ) : (
                        <>
                            <FaPlus style={{ color: '#2e7d32' }} /> Thêm người dùng
                        </>
                    )}
                </Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Họ tên"
                                name="FullName"
                                value={form.FullName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                name="Email"
                                type="email"
                                value={form.Email}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Vai trò (RoleID)"
                                name="RoleID"
                                type="number"
                                value={form.RoleID}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} display="flex" alignItems="center">
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="IsActive"
                                        checked={form.IsActive}
                                        onChange={handleChange}
                                        color="primary"
                                    />
                                }
                                label="Kích hoạt"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" component="label">
                                Chọn ảnh đại diện
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                            {existingAvatar && (
                                <div style={{ marginTop: 10 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Ảnh hiện tại:
                                    </Typography>
                                    <Avatar
                                        src={existingAvatar}
                                        alt="avatar"
                                        sx={{ width: 80, height: 80, border: '1px solid #ddd', mt: 1 }}
                                        variant="rounded"
                                    />
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Huỷ
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserModal;
