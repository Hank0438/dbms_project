# ************************************************************
# Sequel Pro SQL dump
# Version 4529
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.42)
# Database: blog
# Generation Time: 2016-05-03 08:12:45 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



# Dump of table supplier
# ------------------------------------------------------------


DROP TABLE IF EXISTS `supplier`;

CREATE TABLE `supplier` (
`supplier_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
`company_name` varchar(30) NOT NULL DEFAULT '',
`parts` varchar(16) NOT NULL,
`contact_person` varchar(20) NOT NULL,
`supplier_phone` int(12) unsigned NOT NULL,
`supplier_address` varchar(50) NOT NULL,
`supplier_email` varchar(30) NOT NULL,
`member_id` int(11) unsigned NOT NULL,
PRIMARY KEY (`supplier_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table material
# ------------------------------------------------------------


DROP TABLE IF EXISTS `material`;

CREATE TABLE `material` (
`material_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
`parts_name` varchar(16) NOT NULL DEFAULT '',
`inventory_quantity` int(10) unsigned NOT NULL,
`material_price` int(12) unsigned NOT NULL,
`member_id` int(11) unsigned NOT NULL,
PRIMARY KEY (`material_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# Dump of table member
# ------------------------------------------------------------

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `account` varchar(60) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;






# Dump of table dealer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `dealer`;

CREATE TABLE `dealer` (
  `dealer_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dealer_name` varchar(20) NOT NULL DEFAULT '',
  `dealer_phone` int(20) unsigned NOT NULL,
  `dealer_email` text NOT NULL,
  `dealer_address` text NOT NULL,
  `member_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`dealer_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




# Dump of table battery
# ------------------------------------------------------------

DROP TABLE IF EXISTS `battery`;

CREATE TABLE `battery` (
  `battery_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `battery_name` varchar(20) NOT NULL DEFAULT '',
  `battery_price` int(16) unsigned NOT NULL,
  `completed_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `member_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`battery_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
