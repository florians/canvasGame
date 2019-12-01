CREATE DATABASE Game;
USE Game;

DROP TABLE IF EXISTS `Game_Floor`;
CREATE TABLE `Game_Floor` (
  `uid` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` int(11) DEFAULT '0',
  `startX` int(11) DEFAULT '0',
  `startY` int(11) DEFAULT '0',
  `endX` int(11) DEFAULT '0',
  `endY` int(11) DEFAULT '0',
  `height` int(11) DEFAULT '0',
  `width` int(11) DEFAULT '0',
  `tile_json` longtext,
  `endLink` int(11) DEFAULT NULL,
  `startLink` int(11) DEFAULT NULL
)

DROP TABLE IF EXISTS `Game_Tiles`;
CREATE TABLE `Game_Tiles` (
  `uid` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL,
  `collision` tinyint(1) DEFAULT '0',
  `offsetTop` int(11) DEFAULT '0',
  `offsetRight` int(11) DEFAULT '0',
  `offsetLeft` int(11) DEFAULT '0',
  `offsetBottom` int(11) DEFAULT '0'
)
