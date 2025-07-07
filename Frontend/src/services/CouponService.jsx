import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const CouponService = {
    //  Lấy tất cả mã giảm giá (Admin hoặc đã login)
    getAll: async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/coupons`, {
                headers: getAuthHeader(),
            });
            return res.data;
        } catch (err) {
            console.error(" Lỗi lấy danh sách mã giảm giá:", err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Không thể tải danh sách mã giảm giá");
        }
    },

    //  Lấy chi tiết mã giảm giá theo ID
    getById: async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/coupons/${id}`, {
                headers: getAuthHeader(),
            });
            return res.data;
        } catch (err) {
            console.error(` Lỗi lấy mã giảm giá ID ${id}:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Không thể tải thông tin mã giảm giá");
        }
    },

    //  Tạo mã giảm giá mới (Admin)
    create: async (data) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/coupons`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return res.data;
        } catch (err) {
            console.error("Lỗi tạo mã giảm giá:", err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Không thể tạo mã giảm giá");
        }
    },

    //  Cập nhật mã giảm giá (Admin)
    update: async (id, data) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/coupons/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return res.data;
        } catch (err) {
            console.error(` Lỗi cập nhật mã giảm giá ${id}:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Không thể cập nhật mã giảm giá");
        }
    },

    //  Xoá mã giảm giá (Admin)
    remove: async (id) => {
        try {
            const res = await axios.delete(`${API_BASE_URL}/coupons/${id}`, {
                headers: getAuthHeader(),
            });
            return res.data;
        } catch (err) {
            console.error(` Lỗi xoá mã giảm giá ${id}:`, err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Không thể xoá mã giảm giá");
        }
    },

    //  Validate mã giảm giá (Public, khi khách nhập)
    validate: async ({ code, order_total }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/coupons/validate`, {
                code,
                order_total,
            });
            return res.data;
        } catch (err) {
            console.error(" Lỗi kiểm tra mã giảm giá:", err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Mã giảm giá không hợp lệ");
        }
    },
};

export default CouponService;
