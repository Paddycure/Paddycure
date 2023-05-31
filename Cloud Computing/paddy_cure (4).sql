-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2023 at 04:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paddy_cure`
--

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE `berita` (
  `id` varchar(255) NOT NULL,
  `judul_berita` varchar(255) NOT NULL,
  `penulis` varchar(255) NOT NULL,
  `isi_berita` text NOT NULL,
  `img_berita` varchar(255) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id`, `judul_berita`, `penulis`, `isi_berita`, `img_berita`, `timestamp`) VALUES
('809', 'berita aku', '571', 'cerita saya', 'berita-1685439086296-flag-Girls-Bravo-anime-anime-girls-brunette-twintails-1947281-wallhere.com.jpg', '2023-05-30 09:31:26.403187');

-- --------------------------------------------------------

--
-- Table structure for table `order_table`
--

CREATE TABLE `order_table` (
  `id` varchar(255) NOT NULL,
  `user_id` int(100) NOT NULL,
  `jumlah_pesanan` int(100) NOT NULL,
  `total_harga` int(100) NOT NULL,
  `total_harga_pesanan` int(100) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `biaya_transaksi` int(100) NOT NULL,
  `produk_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_table`
--

INSERT INTO `order_table` (`id`, `user_id`, `jumlah_pesanan`, `total_harga`, `total_harga_pesanan`, `timestamp`, `biaya_transaksi`, `produk_id`) VALUES
('102', 124, 100, 100000, 100000000, '2023-05-21 07:39:34.684021', 100002, 123),
('128', 123, 100, 100000, 100000000, '2023-05-21 07:39:24.811309', 100002, 123),
('174', 123, 100, 100000, 100000000, '2023-05-21 07:39:24.187464', 100002, 123),
('192', 123, 100, 100000, 125566, '2023-05-30 12:10:31.354657', 100002, 123),
('260', 124, 100, 100000, 100000000, '2023-05-21 07:39:31.669853', 100002, 123),
('299', 124, 100, 100000, 100000000, '2023-05-21 07:39:35.228363', 100002, 123),
('324', 123, 100, 100000, 100000000, '2023-05-30 12:08:55.883131', 100002, 123),
('326', 123, 100, 100000, 100000000, '2023-05-21 07:39:23.546401', 100002, 123),
('531', 123, 100, 100000, 100000000, '2023-05-21 04:49:29.916629', 100002, 123),
('559', 123, 100, 100000, 100000000, '2023-05-21 07:39:22.876626', 100002, 123),
('579', 124, 100, 100000, 100000000, '2023-05-21 07:39:32.796464', 100002, 123),
('700', 123, 100, 100000, 100000000, '2023-05-30 12:08:54.635103', 100002, 123),
('829', 124, 100, 100000, 100000000, '2023-05-21 07:39:33.276384', 100002, 123),
('859', 123, 100, 100000, 100000000, '2023-05-21 07:39:25.448459', 100002, 123);

-- --------------------------------------------------------

--
-- Table structure for table `paddy`
--

CREATE TABLE `paddy` (
  `id` varchar(255) NOT NULL,
  `user_id` int(100) NOT NULL,
  `img_padi` varchar(255) NOT NULL,
  `catatan` varchar(255) NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `id_disease` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paddy_disease`
--

CREATE TABLE `paddy_disease` (
  `id` varchar(255) NOT NULL,
  `user_id` int(100) NOT NULL,
  `nama_penyakit` varchar(255) NOT NULL,
  `tentang_penyakit` varchar(255) NOT NULL,
  `product_recomendation` varchar(255) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id` varchar(255) NOT NULL,
  `user_id` int(100) NOT NULL,
  `id_produk` varchar(255) NOT NULL,
  `img_produk` varchar(255) NOT NULL,
  `harga_produk` int(100) NOT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `detail_produk` varchar(255) NOT NULL,
  `stok_produk` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id`, `user_id`, `id_produk`, `img_produk`, `harga_produk`, `timestamp`, `detail_produk`, `stok_produk`) VALUES
('132', 123, '123,456,789', 'produk-1685461540721-nyanko-a8499c0724926aba6c246ef238f040f0.jpg', 1000, '0000-00-00 00:00:00.000000', 'zxczxc', 10),
('279', 123, '123,456,789', 'produk-1685461549471-drstone01.jpg', 1000, '0000-00-00 00:00:00.000000', 'zxczxc', 10);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `nomer_hp` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `nama`, `img`, `role`, `timestamp`, `nomer_hp`, `username`, `password`) VALUES
('195', 'hudzaa', 'user-1685438641281-44506ff715fbdf4d0f4310154805ebca.jpg', 'admin', '0000-00-00 00:00:00', 324, 'hudzaaqaaa', '123'),
('814', 'hudzaa', 'user-1685428187171-44506ff715fbdf4d0f4310154805ebca.jpg', 'admin', '0000-00-00 00:00:00', 324, 'hudzaaqaaaa', '123'),
('970', 'undefined', 'user-1685428274907-flag-Girls-Bravo-anime-anime-girls-brunette-twintails-1947281-wallhere.com.jpg', 'admin', '0000-00-00 00:00:00', 324, 'hudzaay', '123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_table`
--
ALTER TABLE `order_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paddy`
--
ALTER TABLE `paddy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paddy_disease`
--
ALTER TABLE `paddy_disease`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
