
-- Tạo CSDL
CREATE DATABASE IF NOT EXISTS MaverickDressesDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE MaverickDressesDB;

-- Bảng Roles: Quản lý vai trò người dùng (Admin, User, Seller)
CREATE TABLE Roles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL
);

-- Bảng Users: Quản lý thông tin người dùng
CREATE TABLE Users (
    UserID CHAR(255) PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100),
    FullName VARCHAR(100),
    Avatar VARCHAR(255), 
    RoleID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID) ON DELETE SET NULL
);

-- Token đăng nhập (Sanctum)
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id CHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL,
    abilities TEXT,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX tokenable_type_id_index (tokenable_type, tokenable_id)
);

-- Thông tin người bán / nhãn hàng
CREATE TABLE SellerInfo (
    SellerID CHAR(255) PRIMARY KEY,
    StoreName VARCHAR(100),
    Description TEXT,
    LogoURL VARCHAR(255),
    Address VARCHAR(300),
    Phone VARCHAR(20),
    Email VARCHAR(100),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SellerID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Danh mục sản phẩm
CREATE TABLE ProductCategory (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL
);

-- Sản phẩm
CREATE TABLE Product (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(200) NOT NULL,
    Description VARCHAR(500),
    Gender ENUM('Male', 'Female', 'Unisex'),
    CategoryID INT,
    ThumbnailURL VARCHAR(300),
    Price DECIMAL(10,2),
    SellerID CHAR(255),
    Status ENUM('Pending', 'Approved', 'Rejected', 'Hidden') DEFAULT 'Pending',
    FOREIGN KEY (CategoryID) REFERENCES ProductCategory(CategoryID) ON DELETE SET NULL,
    FOREIGN KEY (SellerID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Kích thước
CREATE TABLE Size (
    SizeID INT AUTO_INCREMENT PRIMARY KEY,
    SizeName VARCHAR(50) NOT NULL
);

-- Màu sắc
CREATE TABLE Color (
    ColorID INT AUTO_INCREMENT PRIMARY KEY,
    ColorName VARCHAR(50) NOT NULL
);

-- Biến thể sản phẩm
CREATE TABLE ProductVariant (
    VariantID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    SizeID INT,
    ColorID INT,
    Price DECIMAL(10,2),
    StockQuantity INT,
    ImageURL VARCHAR(300),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (SizeID) REFERENCES Size(SizeID) ON DELETE SET NULL,
    FOREIGN KEY (ColorID) REFERENCES Color(ColorID) ON DELETE SET NULL
);

-- Phản hồi
CREATE TABLE Feedback (
    FeedbackID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Message TEXT,
    SubmittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chi nhánh cửa hàng
CREATE TABLE Branch (
    BranchID INT AUTO_INCREMENT PRIMARY KEY,
    BranchName VARCHAR(100),
    Address VARCHAR(300),
    City VARCHAR(100),
    Latitude DOUBLE,
    Longitude DOUBLE,
    Phone VARCHAR(20),
    Email VARCHAR(100)
);

-- Giỏ hàng
CREATE TABLE CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    VariantID INT,
    Quantity INT NOT NULL DEFAULT 1,
    AddedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (VariantID) REFERENCES ProductVariant(VariantID) ON DELETE CASCADE
);
-- Mã giảm giá
CREATE TABLE Coupons (
    CouponID INT AUTO_INCREMENT PRIMARY KEY,
    Code VARCHAR(50) UNIQUE,
    DiscountType ENUM('percentage', 'fixed'),
    DiscountValue DECIMAL(10,2),
    ExpirationDate DATETIME,
    MinOrderValue DECIMAL(10,2),
    IsActive BOOLEAN DEFAULT TRUE
);

-- Đơn hàng
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    CouponID INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(50) DEFAULT 'Pending',
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (CouponID) REFERENCES Coupons(CouponID) ON DELETE SET NULL
);

-- Chi tiết đơn hàng
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    VariantID INT,
    Quantity INT,
    Price DECIMAL(10,2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (VariantID) REFERENCES ProductVariant(VariantID) ON DELETE SET NULL
);

-- Thanh toán
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(50) DEFAULT 'Pending',
    PaidAt DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- Vận chuyển
CREATE TABLE Shipping (
    ShippingID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    RecipientName VARCHAR(100),
    Phone VARCHAR(20),
    Address VARCHAR(300),
    City VARCHAR(100),
    ShippingStatus VARCHAR(50) DEFAULT 'Processing',
    ShippedAt DATETIME,
    DeliveredAt DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- Danh sách yêu thích
CREATE TABLE Wishlist (
    WishlistID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    ProductID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Đánh giá sản phẩm
CREATE TABLE ProductReview (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    ProductID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);


-- Nhật ký hành động người dùng
CREATE TABLE UserActivityLog (
    ActivityID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    ActionType VARCHAR(50),
    ReferenceID INT,
    Metadata JSON,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Lượt xem sản phẩm
CREATE TABLE ProductViews (
    ViewID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    UserID CHAR(255),
    ViewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    DurationSeconds INT,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Tìm kiếm sản phẩm
CREATE TABLE ProductSearches (
    SearchID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    SearchKeyword VARCHAR(255),
    SearchedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Click sản phẩm
CREATE TABLE ProductClickTracking (
    ClickID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    ProductID INT,
    SourcePage VARCHAR(100),
    ClickedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Gợi ý sản phẩm
CREATE TABLE RecommendationLogs (
    RecID INT AUTO_INCREMENT PRIMARY KEY,
    UserID CHAR(255),
    ProductID INT,
    RecommendedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    WasClicked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Thống kê hiệu suất sản phẩm
CREATE TABLE SellerProductStats (
    StatID INT AUTO_INCREMENT PRIMARY KEY,
    SellerID CHAR(255),
    ProductID INT,
    Views INT DEFAULT 0,
    Sales INT DEFAULT 0,
    LastSoldAt DATETIME,
    FOREIGN KEY (SellerID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

-- Doanh thu người bán
CREATE TABLE SellerEarnings (
    EarningID INT AUTO_INCREMENT PRIMARY KEY,
    SellerID CHAR(255),
    OrderID INT,
    Amount DECIMAL(10,2),
    CommissionRate DECIMAL(5,2),
    PayoutStatus ENUM('Pending', 'Paid') DEFAULT 'Pending',
    EarnedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SellerID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE SET NULL
);

-- Dữ liệu mẫu
INSERT INTO Roles (RoleID, RoleName) VALUES 
(1, 'Admin'), 
(2, 'Seller'), 
(3, 'User');
