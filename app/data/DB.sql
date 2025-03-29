-- Database: FitnessAnimDbBetaV1
-- Server version 9.1.0

SET NAMES utf8mb4;
SET TIME_ZONE = '+00:00';
SET UNIQUE_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- Table structure for table `Achievements`
DROP TABLE IF EXISTS `Achievements`;
CREATE TABLE `Achievements` (
  `Achievement_Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` text,
  `XP_Reward` int NOT NULL,
  PRIMARY KEY (`Achievement_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Achievements`
INSERT INTO `Achievements` VALUES 
(1,'Débutant accompli','Atteindre 1000 XP dans le niveau Débutant',500),
(2,'Maître de cardio','Compléter 10 séances de cardio',750),
(3,'Force confirmée','Soulever un poids record en haltérophilie',1000),
(4,'Endurance suprême','Compléter une séance de HIIT de 90 minutes',800),
(5,'Fitness quotidien','S'entraîner 7 jours consécutifs',600);

-- Table structure for table `Exercises`
DROP TABLE IF EXISTS `Exercises`;
CREATE TABLE `Exercises` (
  `Exercise_Id` int NOT NULL AUTO_INCREMENT,
  `Program_Id` int NOT NULL,
  `Exercise_Name` varchar(50) NOT NULL,
  `Time` time DEFAULT NULL,
  `Image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Exercise_Id`),
  KEY `Program_Id` (`Program_Id`),
  CONSTRAINT `Exercises_ibfk_1` FOREIGN KEY (`Program_Id`) REFERENCES `Programs` (`Program_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Exercises`
INSERT INTO `Exercises` VALUES 
(1,1,'Tapis de course - 30 min','00:30:00','https://tse2.mm.bing.net/th?id=OIG1.7pAi5vny_rvbX.CcmAYX&pid=ImgGn'),
(2,2,'Squats avec poids','00:01:00','https://tse2.mm.bing.net/th?id=OIG2.morrhJVynTBuHH6G7q43&pid=ImgGn'),
(3,3,'Étirements matinaux','00:10:00','https://tse3.mm.bing.net/th?id=OIG3.yb2HaUOATkwAT9hYjYUN&pid=ImgGn'),
(4,4,'Burpees - 3 séries de 20','00:00:10','https://tse4.mm.bing.net/th?id=OIG2.Ng1xioHWe0Vq6fw8Poal&pid=ImgGn'),
(5,5,'Soulevé de terre - 4 séries','00:20:00','https://tse4.mm.bing.net/th?id=OIG1.E4zC8fREVJkVKI1TjE_T&pid=ImgGn'),
(6,1,'Pompes - 4 séries de 25','15:00:00','https://tse4.mm.bing.net/th?id=OIG4._RYxBlBdoIh4pBF7u9IR&pid=ImgGn'),
(7,2,'Vélo elliptique - 45 min','45:00:00','https://tse2.mm.bing.net/th?id=OIG2.7ZBtJOEpKWI9826nsQWF&pid=ImgGn'),
(8,3,'Planche - 3 séries de 1 min','10:00:00','https://tse2.mm.bing.net/th?id=OIG4.I2ztFAPPOKKiowNeO4LV&pid=ImgGn'),
(9,4,'Tractions - 3 séries de 12','12:00:00','https://tse1.mm.bing.net/th?id=OIG1.GTZURBhSHH2Y0Q2jDpTw&pid=ImgGn'),
(10,1,'Course à pied - 5km','25:00:00','https://tse1.mm.bing.net/th?id=OIG3.zoEV9XfeypwSDidsnQK7&pid=ImgGn'),
(11,5,'Gainage latéral - 2 min','08:00:00','https://tse3.mm.bing.net/th?id=OIG2.K0NpSybkSHuWw79o2PJV&pid=ImgGn'),
(12,2,'Fentes avant avec haltères','18:00:00','https://tse2.mm.bing.net/th?id=OIG1.etj908EQipJ8tcS9LBmz&pid=ImgGn'),
(13,3,'Rameur - 20 min','20:00:00','https://tse1.mm.bing.net/th?id=OIG2.CGbLeSjetq1tman372Vr&pid=ImgGn'),
(14,4,'Squat sauté - 3 séries','15:00:00','https://tse3.mm.bing.net/th?id=OIG4.Wp.QCVJqkgiP7_j5Bzra&pid=ImgGn'),
(15,5,'Yoga - séquence complète','40:00:00','https://tse1.mm.bing.net/th?id=OIG3.MFKtAA7nn9ogLTQ8S686&pid=ImgGn');

-- Table structure for table `Levels`
DROP TABLE IF EXISTS `Levels`;
CREATE TABLE `Levels` (
  `Level_Id` int NOT NULL AUTO_INCREMENT,
  `Level_Name` varchar(20) NOT NULL,
  `Image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Level_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Levels`
INSERT INTO `Levels` VALUES 
(1,'Débutant','https://tse4.mm.bing.net/th?id=OIG3.RAolgCJjIH4B4ovrt1tf&pid=ImgGn'),
(2,'Intermédiaire','https://tse3.mm.bing.net/th?id=OIG4.KDalKOiPeWuGFa9oalvp&pid=ImgGn'),
(3,'Avancé','https://tse1.mm.bing.net/th?id=OIG2.i8WOYORW3YO41pUGfoxj&pid=ImgGn'),
(4,'Très Avancé','https://tse1.mm.bing.net/th?id=OIG1.L1vcY8ZbHpDakEQMORap&pid=ImgGn');

-- Table structure for table `Goals`
DROP TABLE IF EXISTS `Goals`;
CREATE TABLE `Goals` (
  `Goal_Id` int NOT NULL AUTO_INCREMENT,
  `Level_Id` int NOT NULL,
  `Goal_Name` varchar(50) NOT NULL,
  `Description` text,
  `Image` varchar(255) DEFAULT NULL,
  `Duration` varchar(50) DEFAULT NULL,
  `Improvement` varchar(50) DEFAULT NULL,
  `Followers` int DEFAULT NULL,
  `Impact` varchar(50) DEFAULT NULL,
  `Streak` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Goal_Id`),
  KEY `Level_Id` (`Level_Id`),
  CONSTRAINT `Goals_ibfk_1` FOREIGN KEY (`Level_Id`) REFERENCES `Levels` (`Level_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Goals`
INSERT INTO `Goals` VALUES 
(1,1,'Perte de poids','Programme conçu pour perdre du poids de manière efficace et durable','https://www.pixelstalk.net/wp-content/uploads/2016/08/Brilliant-Colors-of-Nature-1080p-Background.jpg','4 months','-3.7%',1500,'-3.7%','3 months'),
(2,2,'Gain musculaire','Programme de musculation pour un gain musculaire optimisé','https://tse2.mm.bing.net/th?https://tse1.mm.bing.net/th?id=OIG3.MFKtAA7nn9ogLTQ8S686&pid=ImgGn','6 months','+5 kg de muscle',2200,'+5%','4 months'),
(3,3,'Maintien de forme','Programme de maintien de la forme physique et du bien-être','https://tse2.mm.bing.net/th?https://tse1.mm.bing.net/th?id=OIG3.MFKtAA7nn9ogLTQ8S686&pid=ImgGn','Indéfini','Stabilité du poids',1800,'Équilibre général','2 months'),
(4,4,'Endurance cardio','Programme d\'amélioration de l\'endurance cardiovasculaire','https://tse2.mm.bing.net/th?https://tse1.mm.bing.net/th?id=OIG3.MFKtAA7nn9ogLTQ8S686&pid=ImgGn','5 months','+15% VO2 max',2000,'+15%','5 months'),
(5,4,'Force maximale','Programme dédié à l\'augmentation de la force maximale','https://tse2.mm.bing.net/th?https://tse1.mm.bing.net/th?id=OIG3.MFKtAA7nn9ogLTQ8S686&pid=ImgGn','6 months','+20 kg sur les principaux exercices',1700,'+25%','6 months');

-- Table structure for table `Programs`
DROP TABLE IF EXISTS `Programs`;
CREATE TABLE `Programs` (
  `Program_Id` int NOT NULL AUTO_INCREMENT,
  `Goal_Id` int NOT NULL,
  `Program_Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Program_Id`),
  KEY `Goal_Id` (`Goal_Id`),
  CONSTRAINT `Programs_ibfk_1` FOREIGN KEY (`Goal_Id`) REFERENCES `Goals` (`Goal_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Programs`
INSERT INTO `Programs` VALUES 
(1,1,'Cardio intense'),
(2,2,'Programme prise de masse'),
(3,3,'Fitness quotidien'),
(4,4,'Entraînement HIIT'),
(5,5,'Programme haltérophilie');

-- Table structure for table `Progress`
DROP TABLE IF EXISTS `Progress`;
CREATE TABLE `Progress` (
  `Progress_Id` int NOT NULL AUTO_INCREMENT,
  `User_Id` int NOT NULL,
  `Date` date NOT NULL,
  `Weight` decimal(5,2) DEFAULT NULL,
  `Notes` text,
  `Calories_Burned` int DEFAULT NULL,
  `Workout_Duration` int DEFAULT NULL,
  `Workout_Type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Progress_Id`),
  KEY `User_Id` (`User_Id`),
  CONSTRAINT `Progress_ibfk_1` FOREIGN KEY (`User_Id`) REFERENCES `UserAccesFitnessAnimDbV1`.`User` (`User_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Progress`
INSERT INTO `Progress` VALUES 
(1,1,'2024-04-10',74.50,'Bon entraînement, séance cardio',500,60,'Cardio'),
(2,2,'2024-04-11',66.00,'Séance prise de masse réussie',700,75,'Force'),
(3,3,'2024-04-12',84.00,'Maintien de la forme générale',400,45,'Fitness'),
(4,4,'2024-04-13',54.50,'Excellente amélioration endurance',600,90,'Cardio'),
(5,5,'2024-04-14',88.50,'Progression sur les soulevés de terre',800,80,'Force');

-- Reset settings to default values
SET UNIQUE_CHECKS = 1;
SET FOREIGN_KEY_CHECKS = 1;