import ProductDetail from "../pages/Product/ProductDetail";

const DASHBOARD_PATH = "/dashboard";

// Dashboard Subpaths
const CATEGORY_PATH = `${DASHBOARD_PATH}/category`;
const PRODUCT_PATH = `${DASHBOARD_PATH}/product`;
const PRODUCT_V2_PATH = `${DASHBOARD_PATH}/product-v2`;
const USER_PATH = `${DASHBOARD_PATH}/user`;
const BRANCH_PATH = `${DASHBOARD_PATH}/branch`;
const REPORT_PATH = `${DASHBOARD_PATH}/report`;
const FEEDBACK_PATH = `${DASHBOARD_PATH}/feedback`;
const ORDER_PATH = `${DASHBOARD_PATH}/orders`;
const SIZE_PATH = `${DASHBOARD_PATH}/size`;
const COLOR_PATH = `${DASHBOARD_PATH}/color`;
const PROFILE_PATH = `${DASHBOARD_PATH}/profiledashboard`;
const SHIPPING_PATH = `${DASHBOARD_PATH}/shipping`;
const PROMOTION_PATH = `${DASHBOARD_PATH}/promotion`;

export const PATHS = {
    // Public Routes
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",

    // Dashboard Root
    DASHBOARD: DASHBOARD_PATH,

    // Orders
    ORDER_DASHBOARD: ORDER_PATH,
    ORDER_ALL: `${ORDER_PATH}`,
    ORDER_DRAFT: `${ORDER_PATH}/draft`,
    ORDER_PENDING: `${ORDER_PATH}/pending`,
    ORDER_BULK_SHIP: `${ORDER_PATH}/bulk-ship`,

    // Product & Category
    CATEGORY_DASHBOARD: CATEGORY_PATH,
    PRODUCT_DASHBOARD: PRODUCT_PATH,
    PRODUCT_CREATE: `${PRODUCT_PATH}/create`,
    PRODUCT_EDIT: (id) => `${PRODUCT_PATH}/${id}`,
    PRODUCT_V2_DASHBOARD: PRODUCT_V2_PATH,
    PRODUCT_GROUPS: "/dashboard/product/groups",
    PRICING_TABLE: "/dashboard/product/pricing",
    PRODUCT_INVENTORY: "/dashboard/product/inventory",

    // Users & Admin
    USER_DASHBOARD: USER_PATH,
    USER_DETAIL: (id) => `${USER_PATH}/${id}`,
    BRANCH_DASHBOARD: BRANCH_PATH,
    REPORT_DASHBOARD: REPORT_PATH,
    REPORT_ANALYTICS: `${REPORT_PATH}/analytics`,
    FEEDBACK_DASHBOARD: FEEDBACK_PATH,
    SIZE_DASHBOARD: SIZE_PATH,
    COLOR_DASHBOARD: COLOR_PATH,
    PROFILE_DASHBOARD: PROFILE_PATH,

    // Shipping
    SHIPPING_OVERVIEW: `${SHIPPING_PATH}/overview`,
    SHIPPING_LIST: `${SHIPPING_PATH}/list`,
    SHIPPING_COD: `${SHIPPING_PATH}/cod`,
    SHIPPING_PACKING: `${SHIPPING_PATH}/packing`,
    SHIPPING_HANDOVER: `${SHIPPING_PATH}/handover`,
    SHIPPING_RETURN: `${SHIPPING_PATH}/return`,

    // Public Shop Pages
    ABOUT: "/about",
    CONTACT: "/contact",
    PRODUCTDETAIL: "/productdetail",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDER_CONFIRMATION: "/order-confirmation",
    SHOP: "/shop",
    BLOG: "/blog",

    // Khuyến mãi
    PROMOTION_DASHBOARD: PROMOTION_PATH,
};