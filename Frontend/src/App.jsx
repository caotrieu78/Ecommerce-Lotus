import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PATHS } from "./constants/paths";
import './index.css'
import AdminLayout from "./Admin/Layout/AdminLayout";
import MainLayout from "./Layout/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import ProductDetail from "./pages/Product/ProductDetail";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import { Checkout, OrderConfirmation } from "./pages/Checkout";


// Route guards
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";
import SellerRoute from "./routes/SellerRoute";

// Admin pages
import DashboardPage from "./Admin/Pages/DashboardPage";
import CategoryPage from "./Admin/Pages/CategoryPage";
import ProductPage from "./Admin/Pages/ProductPage";
import BranchPage from "./Admin/Pages/BranchPage";
import UserPage from "./Admin/Pages/UserPage";
import ReportPage from "./Admin/Pages/ReportPage";
import FeedbackPage from "./Admin/Pages/FeedbackPage";
import OderPage from "./Admin/Pages/OderPage";
import ProfileDashboard from "./Admin/Pages/ProfileDashboard";

// Order sub-pages
import DraftOrders from "./Admin/Pages/OderPage/DraftOrders";
import PendingOrders from "./Admin/Pages/OderPage/PendingOrders";
import BulkShipOrders from "./Admin/Pages/OderPage/BulkShipOrders";

// Shipping sub-pages
import Overview from "./Admin/Pages/ShipPage/Overview";
import ShippingList from "./Admin/Pages/ShipPage/ShippingList";
import CODManagement from "./Admin/Pages/ShipPage/CODManagement";
import Packing from "./Admin/Pages/ShipPage/Packing";
import HandoverRecord from "./Admin/Pages/ShipPage/HandoverRecord";
import ReturnRecord from "./Admin/Pages/ShipPage/ReturnRecord";
import ProductFormPage from "./Admin/Pages/ProductPage/ProductFormPage";
import InventoryPage from "./Admin/Pages/ProductPage/InventoryPage";
import PricingPage from "./Admin/Pages/ProductPage/PricingPage";
import ProductGroupsPage from "./Admin/Pages/ProductPage/ProductGroupsPage";
import UserDetailPage from "./Admin/Pages/UserPage/UserDetailPage";
import PromotionPage from "./Admin/Pages/Promotion/PromotionPage";
import ReportAnalyticsPage from "./Admin/Pages/ReportPage/ReportAnalyticsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public layout */}
        <Route element={<MainLayout />}>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.ABOUT} element={<About />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.BLOG} element={<Blog />} />
          <Route path={`${PATHS.PRODUCTDETAIL}/:productId`} element={<ProductDetail />} />
          <Route path={PATHS.CART} element={<Cart />} />
          <Route path={PATHS.SHOP} element={<Shop />} />
          <Route path={PATHS.CHECKOUT} element={<Checkout />} />
          <Route path={PATHS.ORDER_CONFIRMATION} element={<OrderConfirmation />} />
          <Route
            path={PATHS.LOGIN}
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path={PATHS.REGISTER}
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
        </Route>
        {/* Admin layout (protected) */}
        <Route
          path={PATHS.DASHBOARD}
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path={PATHS.CATEGORY_DASHBOARD} element={<CategoryPage />} />
          <Route path={PATHS.PRODUCT_DASHBOARD} element={<ProductPage />} />
          <Route path={PATHS.PRODUCT_CREATE} element={<ProductFormPage />} />
          <Route path={PATHS.PRODUCT_EDIT(':id')} element={<ProductFormPage />} />
          <Route path={PATHS.PRODUCT_GROUPS} element={<ProductGroupsPage />} />
          <Route path={PATHS.PRICING_TABLE} element={<PricingPage />} />
          <Route path={PATHS.PRODUCT_INVENTORY} element={<InventoryPage />} />
          <Route path={PATHS.USER_DASHBOARD} element={<UserPage />} />
          <Route path={PATHS.USER_DETAIL(":id")} element={<UserDetailPage />} />
          <Route path={PATHS.BRANCH_DASHBOARD} element={<BranchPage />} />
          <Route path={PATHS.REPORT_DASHBOARD} element={<ReportPage />} />
          <Route path={PATHS.REPORT_ANALYTICS} element={<ReportAnalyticsPage />} />
          <Route path={PATHS.FEEDBACK_DASHBOARD} element={<FeedbackPage />} />
          <Route path={PATHS.ORDER_DASHBOARD} element={<OderPage />} />
          <Route path={PATHS.ORDER_DRAFT} element={<DraftOrders />} />
          <Route path={PATHS.ORDER_PENDING} element={<PendingOrders />} />
          <Route path={PATHS.ORDER_BULK_SHIP} element={<BulkShipOrders />} />
          <Route path={PATHS.SHIPPING_OVERVIEW} element={<Overview />} />
          <Route path={PATHS.SHIPPING_LIST} element={<ShippingList />} />
          <Route path={PATHS.SHIPPING_COD} element={<CODManagement />} />
          <Route path={PATHS.SHIPPING_PACKING} element={<Packing />} />
          <Route path={PATHS.SHIPPING_HANDOVER} element={<HandoverRecord />} />
          <Route path={PATHS.SHIPPING_RETURN} element={<ReturnRecord />} />
          <Route path={PATHS.PROFILE_DASHBOARD} element={<ProfileDashboard />} />
          <Route path={PATHS.PROMOTION_DASHBOARD} element={<PromotionPage />} />
        </Route>
        {/*  Seller layout (protected) */}
        <Route
          path="/seller"
          element={
            <SellerRoute>
              <AdminLayout />
            </SellerRoute>
          }
        >
          <Route index element={<ProductPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create" element={<ProductFormPage />} />
          <Route path="products/edit/:id" element={<ProductFormPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
