assets-- DROP DATABASE `Game`;
-- CREATE DATABASE IF NOT EXISTS `Game`;
-- USE `Game`;

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
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `game`.`assets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`assets` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sorting` INT(10) NULL DEFAULT 0,
  `name` VARCHAR(255) NOT NULL,
  `source` VARCHAR(255) NOT NULL,
  `collision` VARCHAR(255) NOT NULL,
  `type` INT(10) UNSIGNED NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
  );

-- -----------------------------------------------------
-- Table `florian_game`.`assets_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`assets_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `factor` FLOAT(2) NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `florian_game`.`enemy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`enemy` (
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
-- Table `florian_game`.`player`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`player` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `level` INT(10) NULL DEFAULT 0,
  `stats` TEXT NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `florian_game`.`skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`skills` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `type` INT(10) UNSIGNED NOT NULL,
  `cost` INT(10) NULL DEFAULT 0,
  `value` INT(10) NULL DEFAULT 0,
  `turns` INT(10) NULL DEFAULT 0,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `florian_game`.`skills_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`skills_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `deleted` TINYINT(1) NULL DEFAULT 0
);

-- -----------------------------------------------------
-- Table `florian_game`.`enemy_skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`enemy_skills` (
  `enemy_uid` INT(10) UNSIGNED NOT NULL,
  `skills_uid` INT(10) UNSIGNED NOT NULL
);

-- -----------------------------------------------------
-- Table `florian_game`.`player_skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`player_skills` (
  `player_uid` INT(10) UNSIGNED NOT NULL,
  `skills_uid` INT(10) UNSIGNED NOT NULL,
  `level` INT(10) UNSIGNED DEFAULT 1,
  `exp` INT(10) UNSIGNED NOT NULL
);

-- -----------------------------------------------------
-- Table `florian_game`.`passives`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `florian_game`.`passives` (
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
ALTER TABLE `assets` ADD FOREIGN KEY (`type`) REFERENCES `florian_game`.`assets_type` (`uid`);

ALTER TABLE `skills` ADD FOREIGN KEY (`type`) REFERENCES `florian_game`.`skills_type` (`uid`);

ALTER TABLE `enemy_skills` ADD FOREIGN KEY (`enemy_uid`) REFERENCES `florian_game`.`enemy` (`uid`);
ALTER TABLE `enemy_skills` ADD FOREIGN KEY (`skills_uid`) REFERENCES `florian_game`.`skills` (`uid`);

ALTER TABLE `player_skills` ADD FOREIGN KEY (`player_uid`) REFERENCES `florian_game`.`player` (`uid`);
ALTER TABLE `player_skills` ADD FOREIGN KEY (`skills_uid`) REFERENCES `florian_game`.`skills` (`uid`);



-- -----------------------------------------------------
-- Fill DB with basic info
-- -----------------------------------------------------
INSERT INTO `tile_type` VALUES (1,'start',1,0),(2,'portal',1,0),(3,'water',0,0),(4,'grass',1,0),(5,'forest',0.8,0),(6,'snow',0.5,0),(7,'sand',0.6,0),(8,'mountain',0.6,0),(9,'item',1,0),(10,'trap',1,0),(11,'enemy',1,0);

INSERT INTO `skills_type` VALUES (1,'dot','Damage over Time',0),(2,'hot','Heal over Time',0),(3,'heal','Heal',0),(4,'dmg','Damage',0),(5,'buff','Buff',0),(6,'debuff','Debuff',0),(7,'sacrifice ','Sacrifice',0);

INSERT INTO `assets` VALUES (1,1,'start','start.jpg','0',1,0),(2,50,'portal','portal.jpg','0',2,0),(3,100,'water','water.jpg','1,1,1,1',3,0),(4,200,'grass','grass.jpg','0',4,0),(5,210,'grass_wlb','grass_wlb','0,0,1,0',4,0),(6,211,'grass_wlt','grass_wlt.jpg','1,0,0,0',4,0),(7,212,'grass_wrb','grass_wrb.jpg','0,0,0,1',4,0),(8,213,'grass_wrt','grass_wrt.jpg','0,1,0,0',4,0),(9,220,'grass_gl','grass_l.jpg','0,1,0,1',4,0),(10,221,'grass_gr','grass_r.jpg','1,0,1,0',4,0),(11,230,'grass_gt','grass_t.jpg','0,0,1,1',4,0),(12,231,'grass_gb','grass_b.jpg','1,1,0,0',4,0),(13,240,'grass_lb','grass_lb.jpg','1,1,0,1',4,0),(14,241,'grass_lt','grass_lt.jpg','0,1,1,1',4,0),(15,242,'grass_rb','grass_rb.jpg','1,1,1,0',4,0),(16,243,'grass_rt','grass_rt.jpg','1,0,1,1',4,0),(17,300,'forest','forest.jpg','0',5,0),(18,400,'snow','snow.jpg','0',6,0),(19,401,'snow2','snow2.jpg','0',6,0),(20,500,'sand','sand.jpg','0',7,0),(21,600,'mountain','mountain.jpg','0',8,0),(22,1000,'hp','hp.png','0',9,0),(24,2000,'trap','trap.png','0',10,0),(25,3000,'enemy','enemy.png','0',11,0),(30,1001,'key','key.png','0',9,0),(31,1002,'lock','lock.png','0',9,0),(37,1003,'es','es.png','0',9,0);
