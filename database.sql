CREATE DATABASE  IF NOT EXISTS `digital_library` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `digital_library`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: digital_library
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_date` datetime(6) DEFAULT NULL,
  `status` enum('CANCELLED','FULFILLED','WAITING') DEFAULT NULL,
  `book_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm827phjjfy5m6q8vsjmi1gybv` (`book_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKm827phjjfy5m6q8vsjmi1gybv` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2026-09-11 11:33:01.218332','FULFILLED',1,3),(2,'2026-09-11 15:32:45.572556','FULFILLED',4,4);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `isbn` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Robert C. Martin','Programming','9780132350884',5,'Clean Code Updated'),(3,'Joshua Bloch','Java','9780134685991',5,'Effective Java 3rd Edition'),(4,'Herbert Schildt','Programming','9781260440218',1,'Java: The Complete Reference'),(5,'Craig Walls','Programming','9781617294945',5,'Spring Boot in Action');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_queries`
--

DROP TABLE IF EXISTS `contact_queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_queries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `resolved` bit(1) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_queries`
--

LOCK TABLES `contact_queries` WRITE;
/*!40000 ALTER TABLE `contact_queries` DISABLE KEYS */;
INSERT INTO `contact_queries` VALUES (1,'rahul@gmail.com','Is Clean Code available for issue?','Rahul Sharma',_binary '','Book availability','2026-09-11 12:42:38.268446'),(2,'rahul@gmail.com','Please let me know when Java books will be available.','Rahul Sharma',_binary '','Book Availability','2026-09-11 15:35:06.151927');
/*!40000 ALTER TABLE `contact_queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `due_date` datetime(6) DEFAULT NULL,
  `fine_amount` decimal(38,2) DEFAULT NULL,
  `fine_paid` bit(1) NOT NULL,
  `issued_at` datetime(6) DEFAULT NULL,
  `returned_at` datetime(6) DEFAULT NULL,
  `status` enum('ISSUED','RETURNED') DEFAULT NULL,
  `book_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKokwvlrv6o4i4h3le3bwhe6kie` (`book_id`),
  KEY `FK6xxlcjc0rqtn5nq28vjnx5t9d` (`user_id`),
  CONSTRAINT `FK6xxlcjc0rqtn5nq28vjnx5t9d` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKokwvlrv6o4i4h3le3bwhe6kie` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES (1,'2026-09-07 20:25:19.000000',0.00,_binary '','2026-09-10 20:19:40.044714','2026-09-10 20:23:43.147992','RETURNED',1,1),(2,'2026-09-07 20:29:43.000000',15.00,_binary '','2026-09-10 20:28:16.508468','2026-09-10 20:30:59.092847','RETURNED',1,1),(3,'2026-09-07 21:57:48.000000',15.00,_binary '','2026-09-10 21:56:58.932591','2026-09-10 21:59:05.192753','RETURNED',1,3),(4,'2026-09-25 12:27:19.468608',0.00,_binary '','2026-09-11 12:27:19.468608','2026-09-11 12:28:00.693532','RETURNED',1,3),(5,'2026-09-25 14:25:30.753403',0.00,_binary '','2026-09-11 14:25:30.753403','2026-09-11 14:27:49.053124','RETURNED',4,3),(6,'2026-09-25 15:24:16.299412',0.00,_binary '','2026-09-11 15:24:16.299412','2026-09-11 16:00:02.718939','RETURNED',1,4),(7,'2026-09-25 15:26:07.679279',0.00,_binary '','2026-09-11 15:26:07.679279','2026-09-11 15:27:09.672316','RETURNED',3,4),(8,'2026-09-01 15:43:18.000000',50.00,_binary '','2026-09-11 15:43:18.809285','2026-09-11 15:45:06.359768','RETURNED',4,4),(9,'2026-09-25 16:02:36.319942',0.00,_binary '','2026-09-11 16:02:36.319942','2026-09-11 18:33:02.000000','RETURNED',3,5);
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-09-10 14:07:44.389117','mahak@gmail.com','Mahak','$2a$10$v9fxxk3yaR/M08T6FcnEqegDXpx0ZcsS46ZpkOKZfxeZjYaOgptfu','USER'),(2,'2026-09-10 17:30:44.611208','admin@library.com','Library Admin','$2a$10$PCSknoeY5qCu6M6PnVO1Iu1nmYN8/2p7XHPiEpAl3rFQ0f1rrow5S','ADMIN'),(3,'2026-09-10 21:54:22.553299','testuser@gmail.com','Test User','$2a$10$lJY8kO.WPQ6FV5YseVGP5O5fJUWtBjkoKNUdipt5KPLl5hbW95rNy','USER'),(4,'2026-09-11 15:12:57.901213','rahul@gmail.com','Rahul Sharma','$2a$10$hGt6M4R3xiXAZLcxYB1oWOxxyxlM/DsRjku5vFSVxp6C3kSozb6Uu','USER'),(5,'2026-09-11 16:01:00.241547','securitytest@gmail.com','Security Test User','$2a$10$u02LtuyTf4kdErydrNBlfOWPP.2jXQxdzTMDrULxoDPqyUdULIKP2','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'digital_library'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-11 19:42:19
