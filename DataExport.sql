-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: dbecommerce
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `BranchID` int NOT NULL AUTO_INCREMENT,
  `BranchName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `City` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`BranchID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `CartItemID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `VariantID` int DEFAULT NULL,
  `Quantity` int NOT NULL DEFAULT '1',
  `AddedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CartItemID`),
  KEY `UserID` (`UserID`),
  KEY `VariantID` (`VariantID`),
  CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`VariantID`) REFERENCES `productvariant` (`VariantID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES (4,'365dcf87-e255-4ad8-9a3a-fb66f037ffa0',13,1,'2025-07-09 23:27:39');
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `ColorID` int NOT NULL AUTO_INCREMENT,
  `ColorName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ColorID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES (1,'Cam');
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `CouponID` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DiscountType` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DiscountValue` decimal(10,2) DEFAULT NULL,
  `ExpirationDate` datetime DEFAULT NULL,
  `MinOrderValue` decimal(10,2) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`CouponID`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `FeedbackID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Message` text COLLATE utf8mb4_unicode_ci,
  `SubmittedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FeedbackID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `OrderDetailID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `VariantID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`OrderDetailID`),
  KEY `OrderID` (`OrderID`),
  KEY `VariantID` (`VariantID`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE,
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`VariantID`) REFERENCES `productvariant` (`VariantID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (1,1,14,3,12.00),(2,1,13,1,10000000.00);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CouponID` int DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `UserID` (`UserID`),
  KEY `CouponID` (`CouponID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`CouponID`) REFERENCES `coupons` (`CouponID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'365dcf87-e255-4ad8-9a3a-fb66f037ffa0',NULL,'2025-07-09 23:27:30','Pending',10000036.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `PaymentID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `PaymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PaymentStatus` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `PaidAt` datetime DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tokenable_type_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (2,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','e7b51d2c4db2d29ea67d23a91f5296845bf33a40eacc5e52433404b691fd573a','[\"*\"]','2025-07-09 02:56:57',NULL,'2025-07-09 01:06:33','2025-07-09 02:56:57'),(3,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','f33492b56b25dc94a2b8a435f674cdf34f05952ea64cdc75ec4b872e204340ab','[\"*\"]','2025-07-09 01:17:51',NULL,'2025-07-09 01:17:41','2025-07-09 01:17:51'),(5,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','4f40f139c3d4b515a8ec53f5bf29d406859c42d7d4222854d122712e5d98255c','[\"*\"]','2025-07-09 01:29:45',NULL,'2025-07-09 01:29:30','2025-07-09 01:29:45'),(6,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','bc838dc9186728b26ff103bd7bc3d0e0f7d0ea3792f46b32b90cee087daf0e5e','[\"*\"]','2025-07-09 01:30:36',NULL,'2025-07-09 01:29:48','2025-07-09 01:30:36'),(7,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','5ae55859713f3f2aa5375d41d9a9f57fffc43e862b4507e3688cae0e6ad19a32','[\"*\"]','2025-07-09 01:30:51',NULL,'2025-07-09 01:30:44','2025-07-09 01:30:51'),(8,'App\\Models\\User','da815a75-d1f1-4d63-9d24-e6d8fb33bb54','auth_token','dd3447aeb864cf1415cff4472b4327f2c5e47d0ad5b9fa55e7af76e8a660e762','[\"*\"]','2025-07-09 01:39:02',NULL,'2025-07-09 01:31:02','2025-07-09 01:39:02'),(9,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','d3499e35707ebf4bbdc9987648760a6aafa837083316d59468e1f993dc63c231','[\"*\"]','2025-07-09 01:39:16',NULL,'2025-07-09 01:39:09','2025-07-09 01:39:16'),(10,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','cad953c5e89575459e16b2ecfd560cdbaf1bd06989ba8d873980e5aed3c78798','[\"*\"]','2025-07-09 03:05:40',NULL,'2025-07-09 02:55:16','2025-07-09 03:05:40'),(12,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','fbdaea99d986d4de88bb9f23ffbdc5a5dc41699e9fe362c51f76b74fac17a786','[\"*\"]',NULL,NULL,'2025-07-09 03:11:24','2025-07-09 03:11:24'),(13,'App\\Models\\User','da815a75-d1f1-4d63-9d24-e6d8fb33bb54','auth_token','c48f0fa57d51590c6914cc1220a0595d4e9aa95d3e67a267241b6a9c75db50a9','[\"*\"]',NULL,NULL,'2025-07-09 03:11:26','2025-07-09 03:11:26'),(14,'App\\Models\\User','d224525d-5434-4f65-a1ca-c489328dd483','auth_token','420bea009a73b4fd16efacc58aa1e9461e25a6c3c053fbc12f8ae06e57c9a95a','[\"*\"]','2025-07-09 03:13:11',NULL,'2025-07-09 03:11:30','2025-07-09 03:13:11'),(15,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','0a3585aab45fa4a59cc07690f02e9604ea47ee0839321fd19b5bd697c4582b67','[\"*\"]','2025-07-09 05:55:04',NULL,'2025-07-09 03:44:06','2025-07-09 05:55:04'),(16,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','239e643b6f635803b46ed00b5df9beba717da6ad198648be04052f3dbbd0842a','[\"*\"]','2025-07-09 06:41:48',NULL,'2025-07-09 05:53:04','2025-07-09 06:41:48'),(17,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','496359fe2cf8d807c100d8ee31e6ca1a3ca71b9b4db4b5583ce77d08658253dc','[\"*\"]','2025-07-09 06:01:22',NULL,'2025-07-09 05:56:39','2025-07-09 06:01:22'),(18,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','b02ee7f56205e96db06c64eb9415e5ec22ed6a51444994f76561320d00616b4e','[\"*\"]','2025-07-09 06:11:09',NULL,'2025-07-09 06:02:04','2025-07-09 06:11:09'),(20,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','99f380576f7295563863ebb4cbe1dbbfc68f320c5906fbf7fe2b64c2ca7dde22','[\"*\"]','2025-07-09 06:23:28',NULL,'2025-07-09 06:19:21','2025-07-09 06:23:28'),(21,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','07a05d9b67d3ea8b8703850e6908994b8e8bd87b5cac623b8ff9322825c17827','[\"*\"]','2025-07-09 06:43:14',NULL,'2025-07-09 06:25:09','2025-07-09 06:43:14'),(22,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','cd8cd21a6326b65fc0cd716fb413a7d756d39c4bde50a28d0a78aec83e9bfa61','[\"*\"]','2025-07-09 08:25:36',NULL,'2025-07-09 06:43:34','2025-07-09 08:25:36'),(24,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','e646b31a690bb3cc5844c5aef8c3f4b917b1296372282e655930582674313223','[\"*\"]','2025-07-09 08:56:56',NULL,'2025-07-09 08:27:58','2025-07-09 08:56:56'),(25,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','a9b2b9b9ec826908cb3d76a45a2b5887313893df3b20906a27ef955439c31a5f','[\"*\"]','2025-07-09 10:15:32',NULL,'2025-07-09 08:29:56','2025-07-09 10:15:32'),(26,'App\\Models\\User','365dcf87-e255-4ad8-9a3a-fb66f037ffa0','auth_token','c4c9eb39ec352208e7c49b817aff3e3c358a0358becd340ce4a9a64dc30b1021','[\"*\"]','2025-07-09 10:27:34',NULL,'2025-07-09 09:00:14','2025-07-09 10:27:34'),(27,'App\\Models\\User','ea433346-d02c-4b7f-9bf0-a7de0aae8432','auth_token','9bfda834a510d523ff523bf278a98b5f500303a388a57a1881b06ac22ba7e2ba','[\"*\"]','2025-07-09 10:07:04',NULL,'2025-07-09 10:06:56','2025-07-09 10:07:04');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Gender` enum('Male','Female','Unisex') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CategoryID` int DEFAULT NULL,
  `ThumbnailURL` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `SellerID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Status` enum('Pending','Approved','Rejected','Hidden') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  PRIMARY KEY (`ProductID`),
  KEY `CategoryID` (`CategoryID`),
  KEY `SellerID` (`SellerID`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `productcategory` (`CategoryID`) ON DELETE SET NULL,
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`SellerID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Ba rọi đồng quê xông khói (lát) 200g','BA RỌI XÔNG KHÓI CHUẨN NHẬT','Unisex',6,'http://127.0.0.1:8000/images/product/1752056012_p8fe7ddL1d.jpg',199000.00,'5ecc15a5-cc3c-4476-9651-921e603c2e63','Pending'),(2,'CHẢ CÁ QUE KIỂU NHẬT','Sản phẩm chất lượng','Unisex',1,'http://127.0.0.1:8000/images/product/1752065985_780cnQErSZ.jpg',900000.00,'f728dd02-9772-43ba-b99d-8907effc2364','Pending'),(7,'CÁ HỒI TẨM BỘT GIÒN TAN','SẢN PHẨM CHẤT LƯỢNG','Unisex',1,'http://127.0.0.1:8000/images/product/1752075111_SfhToVunPF.jpg',50000.00,'5ecc15a5-cc3c-4476-9651-921e603c2e63','Pending'),(8,'CÀ CHUA TRÁI CÂY GIỐNG NHẬT','SẢN PHẨM CHẤT LƯỢNG','Male',1,'http://127.0.0.1:8000/images/product/1752075202_aXPmkCk6pE.jpg',50000.00,'da815a75-d1f1-4d63-9d24-e6d8fb33bb54','Pending'),(9,'Sản phẩm dinh dưỡng công thức Morinaga cho trẻ từ 0-6 tháng tuổi - Hagukumi 850g','Sản phẩm dinh dưỡng Morinaga số 1 (850g) được nhập khẩu nguyên lon từ Nhật Bản, dành cho trẻ từ 0-6 tháng tuổi.','Unisex',2,'http://127.0.0.1:8000/images/product/1752075328_s3DzRcBvnQ.jpg',595000.00,'da815a75-d1f1-4d63-9d24-e6d8fb33bb54','Pending'),(10,'Chia sẻ: BÁNH TÔM KIỂU NHẬT','Thực phẩm Meiwa ra đời nhằm cổ vũ mọi người cùng trải nghiệm phong cách sống mới,','Male',1,'http://127.0.0.1:8000/images/product/1752075501_Hn047NN3aU.jpg',50000.00,'f728dd02-9772-43ba-b99d-8907effc2364','Pending'),(11,'ReFa COLLAGEN ENRICH JELLY','Collagen cô đặc với trọng lượng phân tử thấp và độ tinh khiết cao.','Unisex',3,'http://127.0.0.1:8000/images/product/1752075610_0qsBfSCuFr.jpg',1460000.00,'ccb130e2-2ee7-4141-8e40-97b7c20cc5f1','Pending'),(12,'Khăn lau kính Clearwipe','Nỗi khó chịu nhất của người bị cận là kính bị dính dấu vân tay, bụi bẩn, hơi nước. Chưa kể lau tạm bằng bề mặt khác (quần áo, giấy ăn,..)','Unisex',3,'http://127.0.0.1:8000/images/product/1752075784_CczDQjlOJd.jpg',50000.00,'592aa393-8ba8-4f32-8830-95cec30a109a','Pending'),(13,'ReFa S CARAT RAY - Cây lăn nâng cơ, săn chắc da','Phương pháp massage đặc biệt nhẹ nhàng và chuẩn xác, giúp giải phóng vẻ rạng rỡ trên gương mặt bạn','Unisex',3,'http://127.0.0.1:8000/images/product/1752075842_ml8Rqp3Fp1.jpg',50000.00,'ccb130e2-2ee7-4141-8e40-97b7c20cc5f1','Pending'),(14,'Sản phẩm dinh dưỡng công thức Morinaga cho trẻ từ 0-6 tháng tuổi - Hagukumi 130g','Sản phẩm dinh dưỡng Morinaga số 1 (130g) được nhập khẩu nguyên lon từ Nhật Bản, dành cho trẻ từ 0-6 tháng tuổi.','Unisex',2,'http://127.0.0.1:8000/images/product/1752075940_eb9UExCQbu.jpg',120000.00,'27ec3c26-1606-49cb-92d8-0fbf4b0487b3','Pending'),(15,'Chia sẻ: Sản phẩm dinh dưỡng công thức Morinaga cho trẻ từ 6-36 tháng tuổi - Chilmil 850g','Sản phẩm dinh dưỡng Morinaga số 2 (850g) được nhập khẩu nguyên lon từ Nhật Bản, dành cho trẻ từ 6-36 tháng tuổi.','Unisex',2,'http://127.0.0.1:8000/images/product/1752076031_UHzw8lqY7a.jpg',535000.00,'27ec3c26-1606-49cb-92d8-0fbf4b0487b3','Pending'),(16,'Lõi lọc nước tại vòi Torayvino MKC.2000B uống trực tiếp','Cho nguồn nước tinh khiết đạt chuẩn Bộ Y Tế, uống trực tiếp tại vòi','Unisex',4,'http://127.0.0.1:8000/images/product/1752076166_mCW9yyexUo.jpg',50000.00,'32ef19de-506d-421e-9c2d-e1be06b7175c','Pending'),(17,'Lõi lọc nước vòi sen tắm khử clo Torayvino RSC.51','àng lọc kép từ vải sợi không dệt và than hoạt tính','Unisex',4,'http://127.0.0.1:8000/images/product/1752076225_eX2zFZ873L.jpg',625000.00,'32ef19de-506d-421e-9c2d-e1be06b7175c','Pending'),(18,'Lõi lọc nước tại vòi Torayvino MKC.TJ chuyên dùng nấu ăn','Loại bỏ vi khuẩn và tạp chất vẫn còn tồn tại trong nước đun sôi','Unisex',4,'http://127.0.0.1:8000/images/product/1752076295_K7OloROqGL.jpg',565000.00,'32ef19de-506d-421e-9c2d-e1be06b7175c','Pending');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productcategory`
--

DROP TABLE IF EXISTS `productcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productcategory` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productcategory`
--

LOCK TABLES `productcategory` WRITE;
/*!40000 ALTER TABLE `productcategory` DISABLE KEYS */;
INSERT INTO `productcategory` VALUES (1,'Thực Phẩm'),(2,'Mẹ và Bé'),(3,'Hóa mỹ phẩm'),(4,'Nhà cửa đời sống'),(5,'Thực phẩm bảo vệ sức khỏe'),(6,'Hàng mới về'),(7,'Sản phẩm khuyến mãi');
/*!40000 ALTER TABLE `productcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productclicktracking`
--

DROP TABLE IF EXISTS `productclicktracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productclicktracking` (
  `ClickID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `SourcePage` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ClickedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ClickID`),
  KEY `UserID` (`UserID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `productclicktracking_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `productclicktracking_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productclicktracking`
--

LOCK TABLES `productclicktracking` WRITE;
/*!40000 ALTER TABLE `productclicktracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `productclicktracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productreview`
--

DROP TABLE IF EXISTS `productreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productreview` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  `Comment` text COLLATE utf8mb4_unicode_ci,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ReviewID`),
  KEY `UserID` (`UserID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `productreview_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `productreview_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `productreview_chk_1` CHECK ((`Rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productreview`
--

LOCK TABLES `productreview` WRITE;
/*!40000 ALTER TABLE `productreview` DISABLE KEYS */;
/*!40000 ALTER TABLE `productreview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productsearches`
--

DROP TABLE IF EXISTS `productsearches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productsearches` (
  `SearchID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SearchKeyword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SearchedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SearchID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `productsearches_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productsearches`
--

LOCK TABLES `productsearches` WRITE;
/*!40000 ALTER TABLE `productsearches` DISABLE KEYS */;
/*!40000 ALTER TABLE `productsearches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productvariant`
--

DROP TABLE IF EXISTS `productvariant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productvariant` (
  `VariantID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int DEFAULT NULL,
  `SizeID` int DEFAULT NULL,
  `ColorID` int DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `StockQuantity` int DEFAULT NULL,
  `ImageURL` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`VariantID`),
  KEY `ProductID` (`ProductID`),
  KEY `SizeID` (`SizeID`),
  KEY `ColorID` (`ColorID`),
  CONSTRAINT `productvariant_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `productvariant_ibfk_2` FOREIGN KEY (`SizeID`) REFERENCES `size` (`SizeID`) ON DELETE SET NULL,
  CONSTRAINT `productvariant_ibfk_3` FOREIGN KEY (`ColorID`) REFERENCES `color` (`ColorID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productvariant`
--

LOCK TABLES `productvariant` WRITE;
/*!40000 ALTER TABLE `productvariant` DISABLE KEYS */;
INSERT INTO `productvariant` VALUES (13,1,1,1,10000000.00,11,NULL),(14,7,1,1,12.00,9,'http://127.0.0.1:8000/images/productv2/1752075111_eXxTP9FGXo.jpg'),(15,9,1,1,20000.00,10,NULL),(16,10,1,1,50000.00,99,NULL),(17,11,1,1,12.00,12,'http://127.0.0.1:8000/images/productv2/1752075610_ud6AAWCQQB.jpg'),(18,12,1,1,50000.00,12,NULL),(19,13,1,1,50000.00,12,'http://127.0.0.1:8000/images/productv2/1752075842_TC301VcQQA.jpg'),(20,14,1,1,120000.00,10,'http://127.0.0.1:8000/images/productv2/1752075940_5qfrxjWUIO.jpg'),(21,15,1,1,535000.00,100,'http://127.0.0.1:8000/images/productv2/1752076007_8eEYmf5F2W.jpg'),(22,16,1,1,50000.00,200,NULL),(23,17,1,1,625000.00,222,'http://127.0.0.1:8000/images/productv2/1752076225_iXLqrjMU1N.jpg'),(24,18,1,1,565000.00,10,'http://127.0.0.1:8000/images/productv2/1752076295_f02mK5hbDU.jpg');
/*!40000 ALTER TABLE `productvariant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productviews`
--

DROP TABLE IF EXISTS `productviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productviews` (
  `ViewID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int DEFAULT NULL,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ViewedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `DurationSeconds` int DEFAULT NULL,
  PRIMARY KEY (`ViewID`),
  KEY `ProductID` (`ProductID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `productviews_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `productviews_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productviews`
--

LOCK TABLES `productviews` WRITE;
/*!40000 ALTER TABLE `productviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `productviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendationlogs`
--

DROP TABLE IF EXISTS `recommendationlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendationlogs` (
  `RecID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `RecommendedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `WasClicked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`RecID`),
  KEY `UserID` (`UserID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `recommendationlogs_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `recommendationlogs_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendationlogs`
--

LOCK TABLES `recommendationlogs` WRITE;
/*!40000 ALTER TABLE `recommendationlogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendationlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(2,'Seller'),(3,'User');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sellerearnings`
--

DROP TABLE IF EXISTS `sellerearnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellerearnings` (
  `EarningID` int NOT NULL AUTO_INCREMENT,
  `SellerID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `OrderID` int DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `CommissionRate` decimal(5,2) DEFAULT NULL,
  `PayoutStatus` enum('Pending','Paid') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `EarnedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EarningID`),
  KEY `SellerID` (`SellerID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `sellerearnings_ibfk_1` FOREIGN KEY (`SellerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `sellerearnings_ibfk_2` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sellerearnings`
--

LOCK TABLES `sellerearnings` WRITE;
/*!40000 ALTER TABLE `sellerearnings` DISABLE KEYS */;
/*!40000 ALTER TABLE `sellerearnings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sellerinfo`
--

DROP TABLE IF EXISTS `sellerinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellerinfo` (
  `SellerID` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `StoreName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci,
  `LogoURL` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SellerID`),
  CONSTRAINT `sellerinfo_ibfk_1` FOREIGN KEY (`SellerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sellerinfo`
--

LOCK TABLES `sellerinfo` WRITE;
/*!40000 ALTER TABLE `sellerinfo` DISABLE KEYS */;
INSERT INTO `sellerinfo` VALUES ('04cfb67f-f430-470e-9476-75fffeaacb99','Popincookin','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054775_DC5dFjpH.jpg','Hồ Chí Minh','0123456789','Popincookin@gmail.com','2025-07-09 16:52:55'),('27ec3c26-1606-49cb-92d8-0fbf4b0487b3','Morinaga','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054695_5k24XasZ.jpg','Hồ Chí Minh','0123456789','morinaga@gmail.com','2025-07-09 16:51:35'),('32ef19de-506d-421e-9c2d-e1be06b7175c','Torayvino','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054901_MRCFdN4E.jpg','Hồ Chí Minh','0123456789','Torayvino@gmail.com','2025-07-09 16:55:01'),('4fa6c2b9-0ef1-4ad4-99a1-52c78e8f411e','Nissui','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054740_B4wehkvW.jpg','Hồ Chí Minh','0123456789','Nissui@gmail.com','2025-07-09 16:52:20'),('592aa393-8ba8-4f32-8830-95cec30a109a','Kobayashi','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054560_Klhd38Uk.jpg','Hồ Chí Minh','0123456789','Kobayashi@gmail.com','2025-07-09 16:49:20'),('5ecc15a5-cc3c-4476-9651-921e603c2e63','Shinshu','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054869_kF8laB5n.jpg','Hồ Chí Minh','0123456789','Shinshu@gmail.com','2025-07-09 16:54:29'),('ccb130e2-2ee7-4141-8e40-97b7c20cc5f1','Refa','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054827_y3xN0DJP.jpg','Hồ Chí Minh','0123456789','Refa@gmail.com','2025-07-09 16:53:47'),('d224525d-5434-4f65-a1ca-c489328dd483','ChuChuBaby','Sản phẩm chất lượng','http://127.0.0.1:8000/images/branch/1752054454_JuL5Tpqj.jpg','Hồ Chí Minh','0123456789','ChuChuBaby@gmail.com','2025-07-09 16:47:34'),('d75687a5-752e-4438-b2ac-a0dc91262f96','Manna','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054601_lT8pMvzc.jpg','Hồ Chí Minh','0123456789','manna@gmail.com','2025-07-09 16:50:01'),('da815a75-d1f1-4d63-9d24-e6d8fb33bb54','Hakubaku','Sản phẩm chất lượng','http://127.0.0.1:8000/images/branch/1752054497_KqbZbTIb.jpg','Hồ Chí Minh','0123456789','Hakubaku@gmail.com','2025-07-09 16:48:17'),('f728dd02-9772-43ba-b99d-8907effc2364','Meiwa','Sản Phẩm Chất Lượng','http://127.0.0.1:8000/images/branch/1752054643_Uf21ULQR.jpg','Hồ Chí Minh','0123456789','Meiwa@gmail.com','2025-07-09 16:50:43');
/*!40000 ALTER TABLE `sellerinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sellerproductstats`
--

DROP TABLE IF EXISTS `sellerproductstats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellerproductstats` (
  `StatID` int NOT NULL AUTO_INCREMENT,
  `SellerID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `Views` int DEFAULT '0',
  `Sales` int DEFAULT '0',
  `LastSoldAt` datetime DEFAULT NULL,
  PRIMARY KEY (`StatID`),
  KEY `SellerID` (`SellerID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `sellerproductstats_ibfk_1` FOREIGN KEY (`SellerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `sellerproductstats_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sellerproductstats`
--

LOCK TABLES `sellerproductstats` WRITE;
/*!40000 ALTER TABLE `sellerproductstats` DISABLE KEYS */;
/*!40000 ALTER TABLE `sellerproductstats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping`
--

DROP TABLE IF EXISTS `shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping` (
  `ShippingID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `RecipientName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `City` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ShippingStatus` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Processing',
  `ShippedAt` datetime DEFAULT NULL,
  `DeliveredAt` datetime DEFAULT NULL,
  PRIMARY KEY (`ShippingID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping`
--

LOCK TABLES `shipping` WRITE;
/*!40000 ALTER TABLE `shipping` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size`
--

DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `SizeID` int NOT NULL AUTO_INCREMENT,
  `SizeName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`SizeID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size`
--

LOCK TABLES `size` WRITE;
/*!40000 ALTER TABLE `size` DISABLE KEYS */;
INSERT INTO `size` VALUES (1,'XL');
/*!40000 ALTER TABLE `size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useractivitylog`
--

DROP TABLE IF EXISTS `useractivitylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useractivitylog` (
  `ActivityID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ActionType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ReferenceID` int DEFAULT NULL,
  `Metadata` json DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ActivityID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `useractivitylog_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useractivitylog`
--

LOCK TABLES `useractivitylog` WRITE;
/*!40000 ALTER TABLE `useractivitylog` DISABLE KEYS */;
/*!40000 ALTER TABLE `useractivitylog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` char(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `FullName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `RoleID` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsActive` tinyint(1) DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('04cfb67f-f430-470e-9476-75fffeaacb99','seller8','$2y$12$c7PSNivyG7RUR7h.Js8cmuHxb46u0mr04uKbaNvvVnSKnCyP/1l5i','seller8@example.com','Popincookin',NULL,2,'2025-07-09 15:10:19',1,NULL),('27ec3c26-1606-49cb-92d8-0fbf4b0487b3','seller6','$2y$12$YamWN/CNpXoTJQYmCqObjOJa0TM6T/AbqGf/OqOkz/hkM122ocTdO','seller6@example.com','Morinaga',NULL,2,'2025-07-09 15:09:50',1,NULL),('32ef19de-506d-421e-9c2d-e1be06b7175c','seller11','$2y$12$irrdLU4/e1uw3WbgeX5p0epBDPN690gLb5hllacXyifvRlegVVVBS','seller11@example.com','Torayvino',NULL,2,'2025-07-09 15:11:08',1,NULL),('365dcf87-e255-4ad8-9a3a-fb66f037ffa0','trieu','$2y$12$qQuyYu6Jvb3XB9XWyzvjs.3HULMTBZQUtSLUe5nw3P.KRYn8MZXv2','caotrieu@gmail.com','nguễn cao triều',NULL,3,'2025-07-09 15:17:38',1,NULL),('4fa6c2b9-0ef1-4ad4-99a1-52c78e8f411e','seller7','$2y$12$yzF6O9xY0jyRk7TC.Ij6ze6GA.BH7eP0UT2uzY/JziWGznDZulRT2','seller7@example.com','Nissui',NULL,2,'2025-07-09 15:10:03',1,NULL),('592aa393-8ba8-4f32-8830-95cec30a109a','seller3','$2y$12$2g3GaqRB/6RzO02fTaNFSeYI/GTRvqIuoD.tLXgs2qCDgfX8VRd/W','seller3@example.com','Kobayashi',NULL,2,'2025-07-09 15:09:04',1,NULL),('5ecc15a5-cc3c-4476-9651-921e603c2e63','seller10','$2y$12$uETLcQEqfMIwLERapU606es/2Wz8kUaeN7DHkYaKBes60UREEUNZW','seller10@example.com','Shinshu',NULL,2,'2025-07-09 15:10:54',1,NULL),('ccb130e2-2ee7-4141-8e40-97b7c20cc5f1','seller9','$2y$12$Bp9yBkVlt.qTiPiTEqISNuS4IdcWMKEGS3PivAiYmVuTPxHUB1Vf6','seller9@example.com','Refa',NULL,2,'2025-07-09 15:10:36',1,NULL),('d224525d-5434-4f65-a1ca-c489328dd483','seller1','$2y$12$sODFNbnNZNnBesCi6AEGU.jpYqPNCj8eVpGA2.COVpQW.shMQ9ezm','seller1@example.com','ChuChuBaby',NULL,2,'2025-07-09 15:07:50',1,NULL),('d75687a5-752e-4438-b2ac-a0dc91262f96','seller4','$2y$12$ShD1xjfyxP8KDiydfoH8HOBftcQqJ1PnVCl7Zu2vyXQAMjZw8R7Xy','seller4@example.com','Manna',NULL,2,'2025-07-09 15:09:16',1,NULL),('da815a75-d1f1-4d63-9d24-e6d8fb33bb54','seller2','$2y$12$zhlNY9OK2dc8VZTEiVabAuHELPkn5/t/aO410ERqGmk8JEdl/naDC','seller2@example.com','Hakubaku',NULL,2,'2025-07-09 15:08:16',1,NULL),('ea433346-d02c-4b7f-9bf0-a7de0aae8432','admin','$2y$12$g5j/tlOoQriJIhGbLreAPOEQTPryTn0K0TKhU2tEy5o.45sN/CDRW','admin@example.com','Admin',NULL,1,'2025-07-09 15:04:00',1,NULL),('f728dd02-9772-43ba-b99d-8907effc2364','seller5','$2y$12$VqNpQRlGV3YdOdQpuNlfBe5olDtDas0l4RRQzVaD75/ONNOByxhC6','seller5@example.com','Meiwa',NULL,2,'2025-07-09 15:09:36',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `WishlistID` int NOT NULL AUTO_INCREMENT,
  `UserID` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`WishlistID`),
  KEY `UserID` (`UserID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-10  0:29:28
