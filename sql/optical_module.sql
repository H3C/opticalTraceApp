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

 Date: 12/07/2019 16:54:27
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

use `optical_module`;

-- ----------------------------
-- Table structure for optical_module
-- ----------------------------
DROP TABLE IF EXISTS `optical_module`;
CREATE TABLE `optical_module`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `bar_code` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '光模块条码',
  `item_code` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '光模块产品编码',
  `owner_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '持有者编码',
  `contract_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '合同号',
  `shipment_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '转移单号',
  `receive_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货方编码',
  `node_date` datetime(0)  NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '节点时间',
  `transfer_permissison` tinyint(2) NOT NULL COMMENT '禁止转移标志位(1.允许 2.禁止)',
  `opt_status` tinyint(2) NOT NULL COMMENT '转移状态(2.持有中 1.转移中)',
  `transfer_note` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '转移备注',
  `status` tinyint(2) NOT NULL COMMENT '数据状态（1.待新增 2.正常 3.待更新）',
  `token` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '操作token值（）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `bar_code`(`bar_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55213 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
