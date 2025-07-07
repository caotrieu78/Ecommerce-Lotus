import axios from 'axios';
import environments from '../constants/environments';

const API_BASE_URL = environments.apiBaseUrl;

// Lấy token từ localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductVariantService = {
    //  Lấy tất cả biến thể (auth required)
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-variants`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(' Lỗi lấy danh sách biến thể:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy danh sách biến thể');
        }
    },

    //  Lấy biến thể theo ID
    getById: async (variantId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-variants/${variantId}`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy biến thể ID ${variantId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy thông tin biến thể');
        }
    },

    //  Tạo biến thể (dùng FormData nếu có ảnh)
    create: async (formData) => {
        try {
            const isFormData = formData instanceof FormData;

            const response = await axios.post(`${API_BASE_URL}/product-variants`, formData, {
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...getAuthHeader(),
                },
            });

            return response.data;
        } catch (error) {
            console.error(' Lỗi tạo biến thể:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể tạo biến thể');
        }
    },

    //  Cập nhật biến thể
    update: async (variantId, data) => {
        try {
            const formData = data instanceof FormData ? data : new FormData();

            if (!(data instanceof FormData)) {
                for (let key in data) {
                    formData.append(key, data[key]);
                }
            }

            formData.append("_method", "PUT");

            const response = await axios.post(`${API_BASE_URL}/product-variants/${variantId}`, formData, {
                headers: {
                    ...(formData instanceof FormData ? {} : { 'Content-Type': 'multipart/form-data' }),
                    ...getAuthHeader(),
                },
            });

            return response.data;
        } catch (error) {
            console.error(` Lỗi cập nhật biến thể ID ${variantId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể cập nhật biến thể');
        }
    },

    //  Xoá biến thể
    delete: async (variantId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/product-variants/${variantId}`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            console.error(` Lỗi xoá biến thể ID ${variantId}:`, error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể xoá biến thể');
        }
    },
    getTotalStock: async (productId = null) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-variants/stock-total`, {
                headers: getAuthHeader(),
                params: productId ? { ProductID: productId } : {}
            });
            return response.data; // { ProductID: x, TotalStock: y }
        } catch (error) {
            console.error('Lỗi lấy tổng tồn kho:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Không thể lấy tổng tồn kho');
        }
    },
};

export default ProductVariantService;
