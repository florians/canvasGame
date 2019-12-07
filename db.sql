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
  `enemy_json` LONGTEXT NULL DEFAULT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`tile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sorting` INT(10) NULL DEFAULT 0,
  `name` VARCHAR(255) NOT NULL,
  `source` VARCHAR(255) NOT NULL,
  `collision` VARCHAR(255) NOT NULL,
  `type` INT(10) UNSIGNED NOT NULL,
  `subtype` INT(10) UNSIGNED NOT NULL,
  `direction` INT(10) UNSIGNED DEFAULT 0,
  `deleted` TINYINT(1) NULL DEFAULT 0
  );

-- -----------------------------------------------------
-- Table `game`.`tile_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`tile_subtype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile_subtype` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `parts` int(10) DEFAULT '0',
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`tile_direction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile_direction` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
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
  `unique_passive` INT(10) NULL DEFAULT 0,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`player`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`player` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `level` INT(10) NULL DEFAULT 0,
  `stats` TEXT NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
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
  `cost` INT(10) NULL DEFAULT 0,
  `value` INT(10) NULL DEFAULT 0,
  `turns` INT(10) NULL DEFAULT 0,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`skills_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`skills_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
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
-- Table `game`.`passives`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`passives` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` VARCHAR(255) NOT NULL,
  `link_to` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- set FOREIGN KEY
-- -----------------------------------------------------
ALTER TABLE `tile` ADD FOREIGN KEY (`type`) REFERENCES `Game`.`tile_type` (`uid`);
ALTER TABLE `tile` ADD FOREIGN KEY (`subtype`) REFERENCES `Game`.`tile_subtype` (`uid`);
ALTER TABLE `tile` ADD FOREIGN KEY (`direction`) REFERENCES `Game`.`tile_direction` (`uid`);

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

INSERT INTO `tile_subtype` (`name`,`parts`)
VALUES
("default",1),
("divided",2),
("edge",4);

INSERT INTO `tile_direction` (`name`)
VALUES
("default"),
("vertical"),
("horizontal"),
("cube");

INSERT INTO `skills_type` (`name`, `description`)
VALUES
("dot","Damage over Time"),
("hot","Heal over Time"),
("heal","Heal"),
("dmg","Damage"),
("buff","Buff"),
("debuff","Debuff"),
("sacrifice ","Sacrifice");

INSERT INTO `tile` (`sorting`,`name`,`type`,`source`,`collision`,`direction`,`subtype`)
VALUES
(1,'start',1,'start.jpg','0',1,1),
(50,'end',2,'end.jpg','1',1,1),
(100,'water',3,'water.jpg','1',1,1),
(120,'water_gl',3,'water_gl.jpg','0,1',2,2),
(121,'water_gr',3,'water_gr.jpg','1,0',2,2),
(130,'water_gt',3,'water_gt.jpg','0,1',3,2),
(131,'water_gb',3,'water_gb.jpg','1,0',3,2),
(140,'water_glb',3,'water_glb.jpg','1,1,0,1',4,3),
(141,'water_glt',3,'water_glt.jpg','0,1,1,1',4,3),
(142,'water_grb',3,'water_grb.jpg','1,1,1,0',4,3),
(143,'water_grt',3,'water_grt.jpg','1,0,1,1',4,3),
(200,'gras',4,'gras.jpg','0',1,1),
(240,'gras_wlb',4,'gras_wlb.jpg','0,0,1,0',4,3),
(241,'gras_wlt',4,'gras_wlt.jpg','1,0,0,0',4,3),
(242,'gras_wrb',4,'gras_wrb.jpg','0,0,0,1',4,3),
(243,'gras_wrt',4,'gras_wrt.jpg','0,1,0,0',4,3),
(300,'forest',5,'forest.jpg','0',1,1),
(400,'snow',6,'snow.jpg','0',1,1),
(500,'sand',7,'sand.jpg','0',1,1),
(600,'mountain',8,'mountain.jpg','0',1,1);
