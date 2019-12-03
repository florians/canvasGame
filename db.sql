DROP DATABASE IF EXISTS `Game`;
CREATE DATABASE Game;
USE Game;

DROP TABLE IF EXISTS `floor`;
CREATE TABLE `floor` (
  `uid` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `level` int(11) DEFAULT '0',
  `startX` int(11) DEFAULT '0',
  `startY` int(11) DEFAULT '0',
  `endLink` int(11) DEFAULT '0',
  `height` int(11) DEFAULT '0',
  `width` int(11) DEFAULT '0',
  `tile_json` longtext,
  `enemy_json` longtext
);

DROP TABLE IF EXISTS `tile`;
CREATE TABLE `tile` (
  `uid` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `subType` varchar(255) DEFAULT 'default',
  `parts` int(11) DEFAULT '0',
  `source` varchar(255) NOT NULL,
  `collision` varchar(255) DEFAULT '0',
  `direction` varchar(255) NULL
);



INSERT INTO tile (name,type,source,subType,parts,collision,direction)
VALUES
('water_glb','water','water_glb.jpg','edge',4,'1,1,0,1','cube'),
('water_glt','water','water_glt.jpg','edge',4,'0,1,1,1','cube'),
('water_grb','water','water_grb.jpg','edge',4,'1,1,1,0','cube'),
('water_grt','water','water_grt.jpg','edge',4,'1,0,1,1','cube');
