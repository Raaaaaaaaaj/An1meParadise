-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 28, 2026 at 10:19 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `an1meparadise`
--

-- --------------------------------------------------------

--
-- Table structure for table `productcategories`
--

DROP TABLE IF EXISTS `productcategories`;
CREATE TABLE IF NOT EXISTS `productcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `productcategories`
--

INSERT INTO `productcategories` (`id`, `category_name`, `created_at`) VALUES
(2, 'Figures', '2026-03-28 08:51:39'),
(3, 'Key Chains', '2026-03-28 08:51:48'),
(4, 'Posters', '2026-03-28 08:51:59'),
(5, 'Accessories', '2026-03-28 08:52:13');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prod_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prod_description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prod_minPrice` decimal(10,2) DEFAULT NULL,
  `prod_actualPrice` decimal(10,2) DEFAULT NULL,
  `prod_maxPrice` decimal(10,2) DEFAULT NULL,
  `prod_qty` int DEFAULT NULL,
  `prod_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prod_createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `prod_category_ID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category` (`prod_category_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `prod_title`, `prod_description`, `prod_minPrice`, `prod_actualPrice`, `prod_maxPrice`, `prod_qty`, `prod_image`, `prod_createdAt`, `prod_category_ID`) VALUES
(5, 'Anime Poster', 'This is a poster', 299.00, 588.00, 799.00, 10, NULL, '2026-03-28 08:58:27', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `userMail` varchar(255) NOT NULL,
  `userMobile` varchar(255) NOT NULL,
  `userCity` varchar(255) NOT NULL,
  `userPass` varchar(255) NOT NULL,
  `userCode` varchar(255) NOT NULL,
  `userCreatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userStatus` varchar(100) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userName`, `userMail`, `userMobile`, `userCity`, `userPass`, `userCode`, `userCreatedAt`, `userStatus`) VALUES
(1, 'Avijit Ghosh', 'raj2222ghosh@gmail.com', '7439612732', 'NORTH 24 PARGANAS', '$2b$10$vzTHQpsXDV2yiPRLnYhFNuhDmbAlDjrYCat11Bnk4VgMlsygErE4C', '00719322-d8a5-4323-b507-90dc2a1ad6e0', '2026-03-27 04:55:01.972516', 'active');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`prod_category_ID`) REFERENCES `productcategories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
