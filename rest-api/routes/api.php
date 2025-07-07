<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Api\V1\{
    AuthController,
    BranchController,
    CartController,
    CategoryController,
    ColorController,
    FeedbackController,
    OrderController,
    ProductController,
    ProductVariantController,
    SizeController,
    UserController,
    StatisticsController,
    SellerInfoController,
    CouponController,
    PaymentController,
    ShippingController,
    WishlistController,
    ProductReviewController,
    UserActivityLogController,
    ProductViewController,
    ProductSearchController,
    ProductClickTrackingController,
    RecommendationLogController,
    SellerDashboardController
};

Route::prefix('v1')->group(function () {

    Route::get('/product-variants/stock-total', [ProductVariantController::class, 'getTotalStock']);
    // 🔓 Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::post('/coupons/validate', [CouponController::class, 'validateCode']);

    Route::apiResources([
        'categories' => CategoryController::class,
        'products' => ProductController::class,
        'product-variants' => ProductVariantController::class,
        'branches' => BranchController::class,
        'sizes' => SizeController::class,
        'colors' => ColorController::class,
    ], ['only' => ['index', 'show']]);

    // Public tracking
    Route::post('/recommend', [RecommendationLogController::class, 'store']);
    Route::post('/recommend/clicked', [RecommendationLogController::class, 'markClicked']);
    Route::post('/search', [ProductSearchController::class, 'store']);
    Route::post('/click', [ProductClickTrackingController::class, 'store']);
    Route::post('/views', [ProductViewController::class, 'store']);

    // 🔐 Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth user info
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/users/me', [UserController::class, 'updateSelf']);

        // ✅ Seller: lấy thông tin nhãn hàng của chính mình
        Route::get('/seller/me', [SellerInfoController::class, 'getMyInfo']);

        // ✅ Coupons
        Route::get('/coupons', [CouponController::class, 'index']);
        Route::get('/coupons/{id}', [CouponController::class, 'show']);

        // Cart
        Route::controller(CartController::class)->prefix('cart')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::put('/', 'update');
            Route::delete('/', 'destroy');
            Route::delete('/clear', 'clearAll');
        });

        // Orders
        Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store']);

        // Payment & Shipping
        Route::apiResource('payments', PaymentController::class)->only(['index', 'store']);
        Route::apiResource('shipping', ShippingController::class)->only(['index', 'store']);
        Route::get('/shipping/order/{orderId}', [ShippingController::class, 'showByOrder']);
        Route::get('/payments/order/{orderId}', [PaymentController::class, 'showByOrder']);

        // Feedback
        Route::get('/feedback', [FeedbackController::class, 'index']);
        Route::get('/feedback/{id}', [FeedbackController::class, 'show']);

        // Wishlist
        Route::apiResource('wishlist', WishlistController::class)->only(['index', 'store', 'destroy']);

        // Reviews
        Route::apiResource('reviews', ProductReviewController::class)->only(['index', 'store', 'destroy']);

        // ✅ Product CRUD (admin & seller)
        Route::apiResource('products', ProductController::class)->only(['store', 'update', 'destroy']);

        // ✅ Product Variant CRUD
        Route::apiResource('product-variants', ProductVariantController::class)->only(['store', 'update', 'destroy']);

        // Seller Dashboard
        Route::get('/seller/earnings', [SellerDashboardController::class, 'earnings']);
        Route::get('/seller/stats', [SellerDashboardController::class, 'productStats']);

        // ✅ Seller Infos (for seller only)
        Route::middleware('seller')->group(function () {
            Route::post('/seller-infos', [SellerInfoController::class, 'store']);
            Route::put('/seller-infos', [SellerInfoController::class, 'update']);
            Route::delete('/seller-infos', [SellerInfoController::class, 'destroy']);
        });

        // ✅ Seller: xem sản phẩm của chính mình
        Route::get('/my-products', [ProductController::class, 'myProducts']);

        // ✅ Admin-only
        Route::middleware('admin')->group(function () {

            Route::get('/admin-only', fn() => response()->json([
                'message' => 'Chào Admin!',
                'user' => auth()->user()
            ]));

            // Payment confirm
            Route::put('/payments/{id}/confirm', [PaymentController::class, 'confirm']);

            // User management
            Route::apiResource('users', UserController::class)->only(['index', 'show', 'update', 'destroy']);

            // Feedback delete
            Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy']);

            // Admin orders
            Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
            Route::put('/orders/{id}', [OrderController::class, 'update']);
            Route::delete('/orders/{id}', [OrderController::class, 'destroy']);


            // Full CRUD for other admin-only resources
            Route::apiResources([
                'categories' => CategoryController::class,
                'branches' => BranchController::class,
                'sizes' => SizeController::class,
                'colors' => ColorController::class,
                'coupons' => CouponController::class,
            ], ['except' => ['index', 'show']]);

            // ✅ SellerInfo view (admin)
            Route::get('/seller-infos', [SellerInfoController::class, 'index']);
            Route::get('/seller-infos/{id}', [SellerInfoController::class, 'show']);

            // Admin statistics
            Route::prefix('admin/statistics')->group(function () {
                Route::get('/overview', [StatisticsController::class, 'overview']);
                Route::get('/monthly', [StatisticsController::class, 'monthly']);
                Route::get('/top-products', [StatisticsController::class, 'topProducts']);
                Route::get('/top-customers', [StatisticsController::class, 'topCustomers']);
            });

            // Analytics & logs
            Route::get('/admin/activity-logs', [UserActivityLogController::class, 'index']);
            Route::get('/admin/recommendations', [RecommendationLogController::class, 'index']);
            Route::get('/admin/clicks', [ProductClickTrackingController::class, 'topClicked']);
            Route::get('/admin/searches', [ProductSearchController::class, 'topKeywords']);
        });
    });
});
