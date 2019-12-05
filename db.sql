DROP DATABASE `Game`;
CREATE DATABASE IF NOT EXISTS `Game`;
USE `Game`;

-- -----------------------------------------------------
-- Table `game`.`floor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`floor` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `level` INT(10) NULL DEFAULT 0,
  `startX` INT(10) NULL DEFAULT 0,
  `startY` INT(10) NULL DEFAULT 0,
  `height` INT(10) NULL DEFAULT 0,
  `width` INT(10) NULL DEFAULT 0,
  `endLink` INT(10) NULL DEFAULT NULL,
  `tile_json` LONGTEXT NULL DEFAULT NULL,
  `enemy_json` LONGTEXT NULL DEFAULT NULL
);

-- -----------------------------------------------------
-- Table `game`.`tile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sorting` INT(10) NULL DEFAULT 0,
  `name` VARCHAR(255) NOT NULL,
  `type` INT(10) UNSIGNED NOT NULL,
  `parts` int(10) DEFAULT '0',
  `subType` VARCHAR(255) NULL DEFAULT NULL,
  `source` VARCHAR(255) NOT NULL,
  `collision` VARCHAR(255) NOT NULL,
  `direction` varchar(255) DEFAULT NULL
);


-- -----------------------------------------------------
-- Table `game`.`tile_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL
);


-- -----------------------------------------------------
-- Table `game`.`enemy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`enemy` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `level_min` INT(10) NULL DEFAULT 0,
  `level_max` INT(10) NULL DEFAULT 0,
  `stats` TEXT NOT NULL,
  `unique` TINYINT(1) NULL DEFAULT 0,
  `unique_passive` INT(10) NULL DEFAULT 0
);
-- -----------------------------------------------------
-- Table `game`.`player`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`player` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `level` INT(10) NULL DEFAULT 0,
  `stats` TEXT NOT NULL
);

-- -----------------------------------------------------
-- Table `game`.`skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`skills` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `level` INT(10) NULL DEFAULT 0,
  `type` INT(10) UNSIGNED NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `turns` INT(10) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`skills_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`skills_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `full_name` TEXT NOT NULL
);

-- -----------------------------------------------------
-- Table `game`.`enemy_skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`enemy_skills` (
  `enemy_uid` INT(10) UNSIGNED NOT NULL,
  `skills_uid` INT(10) UNSIGNED NOT NULL
);

-- -----------------------------------------------------
-- Table `game`.`player_skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`player_skills` (
  `player_uid` INT(10) UNSIGNED NOT NULL,
  `skills_uid` INT(10) UNSIGNED NOT NULL
);

-- -----------------------------------------------------
-- Table `game`.`skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`passives` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `requirements` VARCHAR(255) NOT NULL,
  `link_to` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL
);

-- -----------------------------------------------------
-- set FOREIGN KEY
-- -----------------------------------------------------
ALTER TABLE `tile` ADD FOREIGN KEY (`type`) REFERENCES `Game`.`tile_type` (`uid`);

ALTER TABLE `skills` ADD FOREIGN KEY (`type`) REFERENCES `Game`.`skills_type` (`uid`);

ALTER TABLE `enemy_skills` ADD FOREIGN KEY (`enemy_uid`) REFERENCES `Game`.`enemy` (`uid`);
ALTER TABLE `enemy_skills` ADD FOREIGN KEY (`skills_uid`) REFERENCES `Game`.`skills` (`uid`);

ALTER TABLE `player_skills` ADD FOREIGN KEY (`player_uid`) REFERENCES `Game`.`player` (`uid`);
ALTER TABLE `player_skills` ADD FOREIGN KEY (`skills_uid`) REFERENCES `Game`.`skills` (`uid`);










-- -----------------------------------------------------
-- Fill DB with basic info
-- -----------------------------------------------------
INSERT INTO `tile_type` (`name`)
VALUES
("start"),
("end"),
("water"),
("gras"),
("forest"),
("snow"),
("sand"),
("mountain");

INSERT INTO `skills_type` (`name`, `full_name`)
VALUES
("dot","Damage over Time"),
("hot","Heal over Time"),
("heal","Heal"),
("dmg","Damage"),
("buff","Buff"),
("debuff","Debuff"),
("sacrifice ","Sacrifice");

INSERT INTO `tile` (`sorting`,`name` ,`type`,`subType`,`parts`,`source`,`collision`,`direction`)
VALUES
(1,'start',1,'default',1,'start.jpg','0',NULL),
(50,'end',2,'end',1,'end.jpg','1',NULL),
(100,'water',3,'default',1,'water.jpg','1',NULL),
(120,'water_gl',3,'divided',2,'water_gl.jpg','0,1','vertical'),
(121,'water_gr',3,'divided',2,'water_gr.jpg','1,0','vertical'),
(130,'water_gt',3,'divided',2,'water_gt.jpg','0,1','horizontal'),
(131,'water_gb',3,'divided',2,'water_gb.jpg','1,0','horizontal'),
(140,'water_glb',3,'edge',4,'water_glb.jpg','1,1,0,1','cube'),
(141,'water_glt',3,'edge',4,'water_glt.jpg','0,1,1,1','cube'),
(142,'water_grb',3,'edge',4,'water_grb.jpg','1,1,1,0','cube'),
(143,'water_grt',3,'edge',4,'water_grt.jpg','1,0,1,1','cube'),
(200,'gras',4,'default',1,'gras.jpg','0',NULL),
(240,'gras_wlb',4,'edge',4,'gras_wlb.jpg','0,0,1,0','cube'),
(241,'gras_wlt',4,'edge',4,'gras_wlt.jpg','1,0,0,0','cube'),
(242,'gras_wrb',4,'edge',4,'gras_wrb.jpg','0,0,0,1','cube'),
(243,'gras_wrt',4,'edge',4,'gras_wrt.jpg','0,1,0,0','cube'),
(300,'forest',5,'default',1,'forest.jpg','0',NULL),
(400,'snow',6,'default',1,'snow.jpg','0',NULL),
(500,'sand',7,'default',1,'sand.jpg','0',NULL),
(600,'mountain',8,'default',1,'mountain.jpg','0',NULL);
