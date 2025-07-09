import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const SellerService = {
    // Lấy tổng doanh thu và payout đang chờ
    getEarnings: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seller/earnings`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching seller earnings:', error);
            throw new Error('Unable to fetch earnings');
        }
    },

    // Lấy thống kê hiệu suất sản phẩm
    getProductStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seller/stats`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching product stats:', error);
            throw new Error('Unable to fetch product stats');
        }
    },

    // Lấy thông tin nhãn hàng của seller hiện tại (dùng /seller/me)
    getMyInfo: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seller/me`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching seller info:', error);
            throw new Error('Unable to fetch seller info');
        }
    },

    // Lấy danh sách tất cả nhãn hàng (admin)
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seller-infos`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching all seller infos:', error);
            throw new Error('Unable to fetch seller list');
        }
    },

    // ✅ Tạo nhãn hàng (multipart/form-data)
    createInfo: async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }

            const response = await axios.post(`${API_BASE_URL}/seller-infos`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating seller info:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Unable to create seller info');
        }
    },

    // ✅ Cập nhật nhãn hàng (multipart/form-data)
    updateInfo: async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }

            const response = await axios.post(`${API_BASE_URL}/seller-infos?_method=PUT`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating seller info:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Unable to update seller info');
        }
    },

    // Xoá nhãn hàng
    deleteInfo: async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/seller-infos`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting seller info:', error);
            throw new Error('Unable to delete seller info');
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/seller-infos/${id}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching seller info by ID:', error);
            throw new Error('Unable to fetch seller info by ID');
        }
    },
};

export default SellerService;
