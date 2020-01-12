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
  `deleted` TINYINT(1) NULL DEFAULT 0
  );

-- -----------------------------------------------------
-- Table `game`.`tile_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Game`.`tile_type` (
  `uid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `factor` FLOAT(2) NOT NULL,
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

ALTER TABLE `skills` ADD FOREIGN KEY (`type`) REFERENCES `Game`.`skills_type` (`uid`);

ALTER TABLE `enemy_skills` ADD FOREIGN KEY (`enemy_uid`) REFERENCES `Game`.`enemy` (`uid`);
ALTER TABLE `enemy_skills` ADD FOREIGN KEY (`skills_uid`) REFERENCES `Game`.`skills` (`uid`);

ALTER TABLE `player_skills` ADD FOREIGN KEY (`player_uid`) REFERENCES `Game`.`player` (`uid`);
ALTER TABLE `player_skills` ADD FOREIGN KEY (`skills_uid`) REFERENCES `Game`.`skills` (`uid`);



-- -----------------------------------------------------
-- Fill DB with basic info
-- -----------------------------------------------------
INSERT INTO `tile_type` (`name`,`factor`)
VALUES
("start",1),
("end",1),
("water",0),
("gras",1),
("forest",0.8),
("snow",0.5),
("sand",0.6),
("mountain",0.6),
("item",1),
("trap",1),
("enemy",1);

INSERT INTO `skills_type` (`name`, `description`)
VALUES
("dot","Damage over Time"),
("hot","Heal over Time"),
("heal","Heal"),
("dmg","Damage"),
("buff","Buff"),
("debuff","Debuff"),
("sacrifice ","Sacrifice");

INSERT INTO `tile` (`sorting`,`name`,`type`,`source`,`collision`,`deleted`)
VALUES
(1,'start',1,'start.jpg','0',0),
(50,'end',2,'end.jpg','0',0),
(100,'water',3,'water.jpg','1',0),
(200,'gras',4,'gras.jpg','0',0),
(210,'gras_wlb',4,'gras_wlb.jpg','0,0,1,0',1),
(211,'gras_wlt',4,'gras_wlt.jpg','1,0,0,0',1),
(212,'gras_wrb',4,'gras_wrb.jpg','0,0,0,1',1),
(213,'gras_wrt',4,'gras_wrt.jpg','0,1,0,0',1),
(220,'gras_gl',4,'gras_l.jpg','0,1,0,1',1),
(221,'gras_gr',4,'gras_r.jpg','1,0,1,0',1),
(230,'gras_gt',4,'gras_t.jpg','0,0,1,1'),
(231,'gras_gb',4,'gras_b.jpg','1,1,0,0',1),
(240,'gras_glb',4,'gras_lb.jpg','1,1,0,1',1),
(241,'gras_glt',4,'gras_lt.jpg','0,1,1,1',1),
(242,'gras_grb',4,'gras_rb.jpg','1,1,1,0',1),
(243,'gras_grt',4,'gras_rt.jpg','1,0,1,1',1),
(300,'forest',5,'forest.jpg','0',0),
(400,'snow',6,'snow.jpg','0',0),
(401,'snow2',6,'snow2.jpg','0',0),
(500,'sand',7,'sand.jpg','0',0),
(600,'mountain',8,'mountain.jpg','0',0),
(1000,'hp',9,'hp.png','0',0),
(1010,'mp',9,'mp.png','0',1),
(2000,'trap',10,'trap.png','0',0),
(3000,'enemy',10,'enemy.png','0',0);
