/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80016
 Source Host           : localhost:3306
 Source Schema         : optical_module

 Target Server Type    : MySQL
 Target Server Version : 80016
 File Encoding         : 65001

 Date: 12/07/2019 16:53:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

use `optical_module`;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_organ` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_sso_correlation` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `token` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
