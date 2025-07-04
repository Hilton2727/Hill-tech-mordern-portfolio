-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2025 at 12:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'online',
  `title` varchar(255) DEFAULT 'Software Engineer',
  `rotating_texts` text DEFAULT NULL,
  `creative_text` varchar(255) DEFAULT 'Creative'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about`
--

INSERT INTO `about` (`id`, `profile_image`, `status`, `title`, `rotating_texts`, `creative_text`) VALUES
(1, '/uploads/6864ddad079a1_profile.jpg', 'offline', 'Hardware Engineer', '[\"Developer\",\"Designer\",\"Thinker\"]', 'Creative');

-- --------------------------------------------------------

--
-- Table structure for table `about_paragraphs`
--

CREATE TABLE `about_paragraphs` (
  `id` int(11) NOT NULL,
  `about_id` int(11) NOT NULL,
  `paragraph` text NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_paragraphs`
--

INSERT INTO `about_paragraphs` (`id`, `about_id`, `paragraph`, `position`) VALUES
(79, 1, 'Hello! I\'m a passionate designer and developer with over 2 years of experience crafting digital experiences that delight users and solve real problems.', 0),
(80, 1, 'My journey in tech began when I built my first website at 16. Since then, I\'ve worked with startups and established companies to create innovative solutions that blend form and function.', 1),
(81, 1, 'When I\'m not coding, you\'ll find me exploring hiking trails, experimenting with new cooking recipes, or learning about emerging technologies.', 2);

-- --------------------------------------------------------

--
-- Table structure for table `about_stats`
--

CREATE TABLE `about_stats` (
  `id` int(11) NOT NULL,
  `about_id` int(11) NOT NULL,
  `value` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_stats`
--

INSERT INTO `about_stats` (`id`, `about_id`, `value`, `label`, `position`) VALUES
(98, 1, '2+', 'Years Experience', 0),
(99, 1, '20+', 'Projects Completed', 1),
(100, 1, '10+', 'Happy Clients', 2),
(101, 1, '3+', 'Design Awards', 3);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'itsehhilton@gmail.com', '$2y$10$Ifx7fdIQKSDRdba7FlYWiOnDaxI1mFcAbQzTACr7//tL1KXjCQit2', '2025-06-30 19:28:27', '2025-06-30 23:30:40'),
(6, 'admin@example.com', '$2y$10$yyw7DMj7ag.ZDzSv9gwaYuztZTpV44iYzj6lWMPI4UL7CoNJxAVVq', '2025-07-03 14:14:14', '2025-07-03 14:14:14');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `location`, `email`, `phone`, `created_at`, `updated_at`) VALUES
(1, 'Benin City, Edo State ', 'itsehhilton@gmail.com', '+234 (814) 886-8023', '2025-07-02 00:51:19', '2025-07-02 00:57:28');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` enum('resume','image','document','other') DEFAULT 'other'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero`
--

CREATE TABLE `hero` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tagline` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero`
--

INSERT INTO `hero` (`id`, `name`, `tagline`) VALUES
(1, 'Hilton Itseh', 'I design and build digital experiences with a focus on usability and performance');

-- --------------------------------------------------------

--
-- Table structure for table `hero_social_links`
--

CREATE TABLE `hero_social_links` (
  `id` int(11) NOT NULL,
  `hero_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hero_social_links`
--

INSERT INTO `hero_social_links` (`id`, `hero_id`, `name`, `url`, `icon`) VALUES
(56, 1, 'Github', 'https://github.com/Hilton2727', 'Github'),
(57, 1, 'LinkedIn', '#', 'Linkedin'),
(58, 1, 'Twitter', '#', 'Twitter');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(512) NOT NULL,
  `demoLink` varchar(255) NOT NULL,
  `codeLink` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `image`, `demoLink`, `codeLink`, `category`) VALUES
(1, 'E-commerce Platform', 'A full-featured online store with shopping cart, user authentication, and payment processing.', 'https://placehold.co/600x400/e9ecef/495057?text=E-commerce+Platform', '#', '#', 'web'),
(2, 'Scribe Blog', 'Scribe Blog is a community-driven platform where users can request to publish their articles. The platform is monetized through ads, and both the article creators and readers share in the ad revenue.\n\nTo maintain transparency, the ad revenue balance and statistics are publicly displayed, allowing all users to see how much has been generated and how it''s distributed. This open model reinforces trust and encourages active participation from the community.', '/uploads/68652793341db_Screenshot_30-6-2025_154642_scribe.infy.uk.jpeg', 'scribe.infy.uk', '#', 'web'),
(3, 'Portfolio Website', 'A responsive portfolio website showcasing my work and skills.', 'https://placehold.co/600x400/e9ecef/495057?text=Portfolio', '#', '#', 'web'),
(4, 'iOS Weather App', 'A clean and intuitive weather application with detailed forecasts.', 'https://placehold.co/600x400/e9ecef/495057?text=Weather+App', '#', '#', 'mobile'),
(5, 'Brand Identity Design', 'Complete brand identity package for a sustainable fashion startup.', 'https://placehold.co/600x400/e9ecef/495057?text=Brand+Design', '#', '#', 'design'),
(6, 'Chat Application', 'Real-time messaging application with group chat functionality.', 'https://placehold.co/600x400/e9ecef/495057?text=Chat+App', '#', '#', 'web');

-- --------------------------------------------------------

--
-- Table structure for table `project_tags`
--

CREATE TABLE `project_tags` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `tag` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_tags`
--

INSERT INTO `project_tags` (`id`, `project_id`, `tag`) VALUES
(1, 1, 'React'),
(2, 1, 'Node.js'),
(3, 1, 'MongoDB'),
(4, 1, 'Stripe'),
(8, 3, 'React'),
(9, 3, 'Tailwind CSS'),
(10, 3, 'Framer Motion'),
(11, 4, 'Swift'),
(12, 4, 'Weather API'),
(13, 4, 'CoreLocation'),
(14, 5, 'Branding'),
(15, 5, 'Logo Design'),
(16, 5, 'Style Guide'),
(17, 6, 'React'),
(18, 6, 'Socket.io'),
(19, 6, 'Express'),
(20, 2, 'React'),
(21, 2, 'Redux'),
(22, 2, 'Firebase');

-- --------------------------------------------------------

--
-- Table structure for table `resume`
--

CREATE TABLE `resume` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `site_name` varchar(255) NOT NULL DEFAULT 'Hill tech',
  `site_logo` varchar(255) DEFAULT '/uploads/logo.png',
  `favicon` varchar(255) DEFAULT '/favicon.ico',
  `site_title` varchar(255) DEFAULT 'crafted-ui-gallery',
  `site_description` varchar(255) DEFAULT 'Lovable Generated Project',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `site_url` varchar(255) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `site_name`, `site_logo`, `favicon`, `site_title`, `site_description`, `created_at`, `updated_at`, `site_url`) VALUES
(1, 'Hill entertainment ', '/uploads/68653b1366164_ChatGPT Image Jul 1, 2025, 02_19_56 PM.png', '/uploads/68653b20108c1_favicon.ico', 'Hill entertaionment ', 'entertainment ', '2025-07-02 14:00:31', '2025-07-03 20:56:02', '');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `title`, `icon`) VALUES
(1, 'Frontend Development', 'Layout'),
(2, 'Backend Development', 'Database'),
(3, 'Mobile Development', 'Smartphone'),
(4, 'UI/UX Design', 'Palette'),
(5, 'DevOps', 'GitBranch'),
(6, 'Data Visualization', 'LineChart'),
(7, 'Web Performance', 'Layers'),
(8, 'Languages', 'Code'),
(9, 'mmmmmm', 'Code');

-- --------------------------------------------------------

--
-- Table structure for table `skill_items`
--

CREATE TABLE `skill_items` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `skill` varchar(100) NOT NULL,
  `position` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill_items`
--

INSERT INTO `skill_items` (`id`, `skill_id`, `skill`, `position`) VALUES
(1, 1, 'HTML/CSS', 1),
(2, 1, 'JavaScript', 2),
(3, 1, 'React', 3),
(4, 1, 'Vue.js', 4),
(5, 1, 'Tailwind CSS', 5),
(6, 1, 'TypeScript', 6),
(7, 2, 'Node.js', 1),
(8, 2, 'Express', 2),
(9, 2, 'Python', 3),
(10, 2, 'Django', 4),
(11, 2, 'Java', 5),
(12, 2, 'RESTful APIs', 6),
(13, 3, 'React Native', 1),
(14, 3, 'Flutter', 2),
(15, 3, 'iOS (Swift)', 3),
(16, 3, 'Android (Kotlin)', 4),
(17, 4, 'Figma', 1),
(18, 4, 'Adobe XD', 2),
(19, 4, 'Sketch', 3),
(20, 4, 'User Research', 4),
(21, 4, 'Prototyping', 5),
(22, 5, 'Git', 1),
(23, 5, 'CI/CD', 2),
(24, 5, 'Docker', 3),
(25, 5, 'AWS', 4),
(26, 5, 'Serverless', 5),
(27, 6, 'D3.js', 1),
(28, 6, 'Recharts', 2),
(29, 6, 'Canvas', 3),
(30, 6, 'SVG Animations', 4),
(31, 7, 'Lighthouse', 1),
(32, 7, 'Performance Budgeting', 2),
(33, 7, 'Lazy Loading', 3),
(34, 7, 'Optimization', 4),
(35, 8, 'JavaScript', 1),
(36, 8, 'TypeScript', 2),
(37, 8, 'Python', 3),
(38, 8, 'Java', 4),
(39, 8, 'Swift', 5),
(40, 8, 'PHP', 6),
(41, 9, 'game', 0),
(42, 9, 'playing', 1),
(43, 9, 'jgj', 2);

-- --------------------------------------------------------

--
-- Table structure for table `smtp_settings`
--

CREATE TABLE `smtp_settings` (
  `id` int(11) NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` int(11) NOT NULL DEFAULT 587,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `encryption` varchar(50) DEFAULT 'tls',
  `from_email` varchar(255) NOT NULL,
  `from_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `smtp_settings`
--

INSERT INTO `smtp_settings` (`id`, `host`, `port`, `username`, `password`, `encryption`, `from_email`, `from_name`, `created_at`, `updated_at`) VALUES
(1, '', 587, '', '', 'tls', '', '', '2025-07-03 13:52:37', '2025-07-03 14:14:25');

-- --------------------------------------------------------

--
-- Table structure for table `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `contact_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_links`
--

INSERT INTO `social_links` (`id`, `contact_id`, `name`, `url`, `icon`, `created_at`, `updated_at`) VALUES
(7, 1, 'Twitter', '#', 'Twitter', '2025-07-02 00:57:28', '2025-07-02 00:57:28'),
(8, 1, 'LinkedIn', '#', 'Linkedin', '2025-07-02 00:57:28', '2025-07-02 00:57:28'),
(9, 1, 'GitHub', 'https://github.com/Hilton2727', 'Github', '2025-07-02 00:57:28', '2025-07-02 00:57:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `about_paragraphs`
--
ALTER TABLE `about_paragraphs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `about_id` (`about_id`);

--
-- Indexes for table `about_stats`
--
ALTER TABLE `about_stats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `about_id` (`about_id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero`
--
ALTER TABLE `hero`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero_social_links`
--
ALTER TABLE `hero_social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hero_id` (`hero_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_tags`
--
ALTER TABLE `project_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `resume`
--
ALTER TABLE `resume`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skill_items`
--
ALTER TABLE `skill_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `smtp_settings`
--
ALTER TABLE `smtp_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_id` (`contact_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about`
--
ALTER TABLE `about`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `about_paragraphs`
--
ALTER TABLE `about_paragraphs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `about_stats`
--
ALTER TABLE `about_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero`
--
ALTER TABLE `hero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hero_social_links`
--
ALTER TABLE `hero_social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `project_tags`
--
ALTER TABLE `project_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `resume`
--
ALTER TABLE `resume`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `skill_items`
--
ALTER TABLE `skill_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `smtp_settings`
--
ALTER TABLE `smtp_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `about_paragraphs`
--
ALTER TABLE `about_paragraphs`
  ADD CONSTRAINT `about_paragraphs_ibfk_1` FOREIGN KEY (`about_id`) REFERENCES `about` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_stats`
--
ALTER TABLE `about_stats`
  ADD CONSTRAINT `about_stats_ibfk_1` FOREIGN KEY (`about_id`) REFERENCES `about` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_social_links`
--
ALTER TABLE `hero_social_links`
  ADD CONSTRAINT `hero_social_links_ibfk_1` FOREIGN KEY (`hero_id`) REFERENCES `hero` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_tags`
--
ALTER TABLE `project_tags`
  ADD CONSTRAINT `project_tags_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `skill_items`
--
ALTER TABLE `skill_items`
  ADD CONSTRAINT `skill_items_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `social_links_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
