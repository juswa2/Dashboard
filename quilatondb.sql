-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2024 at 03:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quilatondb`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `middle_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `pnumber` int(10) NOT NULL,
  `fb` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `suffix` varchar(30) DEFAULT NULL,
  `account_type` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=admin, 2=staff, 3=client, 4=retainer',
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `first_name`, `middle_name`, `last_name`, `email`, `pnumber`, `fb`, `username`, `password`, `suffix`, `account_type`, `image`) VALUES
(36, 'Jamess', 'Jacks', 'Zacks', 'jamess@gmail.com', 0, '', 'james1', 'james123', NULL, 1, 'image_1713025805749.png'),
(51, 'retain', '', 'lee', '', 0, '', 'retain', 'retain1234', '', 4, 'image_1713511581864.jpg'),
(52, 'Reggie', '', 'Macariola', '', 0, '', 'reggie', 'reggie123', '', 3, ''),
(53, 'Joshua', '', 'Mac', '', 0, '', 'josh', 'josh123', '', 4, '');

-- --------------------------------------------------------

--
-- Table structure for table `client_case`
--

CREATE TABLE `client_case` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `case_title` varchar(30) NOT NULL,
  `client_status` varchar(30) NOT NULL,
  `client_file` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_case`
--

INSERT INTO `client_case` (`id`, `client_id`, `case_title`, `client_status`, `client_file`, `date`, `date_created`) VALUES
(29, 52, 'Rape', 'active', 'mletter.pdf', '2024-04-19', '2024-04-19 15:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `client_statuses`
--

CREATE TABLE `client_statuses` (
  `id` int(11) NOT NULL,
  `client_case_id` int(11) NOT NULL,
  `status` varchar(30) NOT NULL,
  `file` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_statuses`
--

INSERT INTO `client_statuses` (`id`, `client_case_id`, `status`, `file`, `date`, `date_created`) VALUES
(18, 29, 'checking', 'mletter (1).pdf', '2024-04-19', '2024-04-19 15:44:31');

-- --------------------------------------------------------

--
-- Table structure for table `retainer_case`
--

CREATE TABLE `retainer_case` (
  `id` int(11) NOT NULL,
  `retainer_id` int(11) NOT NULL,
  `case_title` varchar(30) NOT NULL,
  `retainer_status` varchar(30) NOT NULL,
  `retainer_file` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `retainer_case`
--

INSERT INTO `retainer_case` (`id`, `retainer_id`, `case_title`, `retainer_status`, `retainer_file`, `date`, `date_created`) VALUES
(9, 51, 'rape', 'active', 'mletter.pdf', '2024-04-19', '2024-04-19 15:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `retainer_statuses`
--

CREATE TABLE `retainer_statuses` (
  `id` int(11) NOT NULL,
  `retainer_case_id` int(11) NOT NULL,
  `status` varchar(30) NOT NULL,
  `file` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client_case`
--
ALTER TABLE `client_case`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_case1` (`client_id`);

--
-- Indexes for table `client_statuses`
--
ALTER TABLE `client_statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_status1` (`client_case_id`);

--
-- Indexes for table `retainer_case`
--
ALTER TABLE `retainer_case`
  ADD PRIMARY KEY (`id`),
  ADD KEY `retainer_case1` (`retainer_id`);

--
-- Indexes for table `retainer_statuses`
--
ALTER TABLE `retainer_statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `retainer_status1` (`retainer_case_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `client_case`
--
ALTER TABLE `client_case`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `client_statuses`
--
ALTER TABLE `client_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `retainer_case`
--
ALTER TABLE `retainer_case`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `retainer_statuses`
--
ALTER TABLE `retainer_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `client_case`
--
ALTER TABLE `client_case`
  ADD CONSTRAINT `client_case1` FOREIGN KEY (`client_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `client_statuses`
--
ALTER TABLE `client_statuses`
  ADD CONSTRAINT `client_status1` FOREIGN KEY (`client_case_id`) REFERENCES `client_case` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `retainer_case`
--
ALTER TABLE `retainer_case`
  ADD CONSTRAINT `retainer_case1` FOREIGN KEY (`retainer_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `retainer_statuses`
--
ALTER TABLE `retainer_statuses`
  ADD CONSTRAINT `retainer_status1` FOREIGN KEY (`retainer_case_id`) REFERENCES `retainer_case` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
