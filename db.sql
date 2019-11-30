-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE DATABASE Game;
USE Game;

CREATE TABLE Game_Floor (
    uid int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    level int DEFAULT 0,
    startX int  DEFAULT 0,
    startY int  DEFAULT 0,
    endX int  DEFAULT 0,
    endY int  DEFAULT 0,
    height int  DEFAULT 0 ,
    width int DEFAULT 0 ,
    tile_json LONGTEXT
);

CREATE TABLE Game_Tiles (
    uid int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL ,
    color VARCHAR(255),
    source VARCHAR(255) NOT NULL ,
    collision boolean DEFAULT 0,
    offsetTop int  DEFAULT 0,
    offsetRight int  DEFAULT 0,
    offsetLeft int  DEFAULT 0,
    offsetBottom int  DEFAULT 0
);
