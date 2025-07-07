// src/services/PaymentService.js
import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const PaymentService = {
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/payments`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi tạo thanh toán:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo thanh toán');
        }
    },

    getByOrderId: async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/payments/order/${orderId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy thông tin thanh toán:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin thanh toán');
        }
    },

    updateStatus: async (paymentId, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/payments/${paymentId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái thanh toán:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
        }
    },

    confirmPayment: async (paymentId) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/payments/${paymentId}/confirm`, {}, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi xác nhận thanh toán:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xác nhận thanh toán');
        }
    },
};

export default PaymentService;
