-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 26, 2026 at 09:40 AM
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
(1, 'Avijit Ghosh', 'raj2222ghosh@gmail.com', '7439612732', 'Kolkata', '$2b$10$9.Kd0z/tEXrKI0rWOkvnkub9xORyI2PJ04PRCW9wc0szEjZKvLx2a', '88a2c94b-35d7-41c4-a160-86f171e3fa3f', '2026-03-24 16:01:14.628852', 'active');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
