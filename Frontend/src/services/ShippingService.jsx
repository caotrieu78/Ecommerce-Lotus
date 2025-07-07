import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ShippingService = {
    //  Tạo thông tin vận chuyển
    create: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/shipping`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(' Lỗi tạo vận chuyển:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo vận chuyển');
        }
    },

    //  Xem vận chuyển theo OrderID (đã dùng route: /shipping/order/{orderId})
    getByOrderId: async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/shipping/order/${orderId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(' Lỗi lấy thông tin vận chuyển:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin vận chuyển');
        }
    },

    // (Tuỳ chọn)  Cập nhật trạng thái vận chuyển (admin dùng)
    updateStatus: async (shippingId, data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/shipping/${shippingId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(' Lỗi cập nhật trạng thái vận chuyển:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái vận chuyển');
        }
    }
};

export default ShippingService;
