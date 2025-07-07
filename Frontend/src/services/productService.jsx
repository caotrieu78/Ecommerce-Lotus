import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

// Lấy token từ localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products`, {
                headers: {
                    Accept: 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi lấy danh sách sản phẩm:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sản phẩm');
        }
    },

    getById: async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi lấy sản phẩm ID ${productId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin sản phẩm');
        }
    },

    getMyProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/my-products`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi lấy sản phẩm của tôi:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy sản phẩm của bạn');
        }
    },

    create: async (productData) => {
        try {
            const formData = productData instanceof FormData ? productData : new FormData();

            if (!(productData instanceof FormData)) {
                for (let key in productData) {
                    formData.append(key, productData[key]);
                }
            }

            const response = await axios.post(`${API_BASE_URL}/products`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Lỗi tạo sản phẩm:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo sản phẩm');
        }
    },


    update: async (productId, data) => {
        try {
            data.append('_method', 'PUT'); // Laravel cần để hiểu là PUT
            const response = await axios.post(`${API_BASE_URL}/products/${productId}`, data, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi cập nhật sản phẩm ${productId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật sản phẩm');
        }
    },


    delete: async (productId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi xoá sản phẩm ID ${productId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá sản phẩm');
        }
    },
};

export default ProductService;
