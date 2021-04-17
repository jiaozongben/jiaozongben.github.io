---
layout: post
title:  接口测试-常用自定义函数(二)
no-post-nav: false
category: api-test
tags: [api-test]
excerpt: 接口测试


---



## 接口测试-常用的自定义函数

自定义函数拓展性很强，在 测试数据、参数校验，测试前置、测试后置 、MockService中有广泛用途，

具体方法实现可以参考函数明细

### 时间获取类

使用场景: 交易日期加减

| get_date_Y_m_d()         | 获取年月日       | 2021-04-17                                       |
| ------------------------ | ---------------- | ------------------------------------------------ |
| get_date_H_M_S()         | 获取时分秒       | 23:15:01                                         |
| get_date_Y_m_d_H_M_S()   | 获取年月日时分秒 | 2021-04-17 23:15:01                              |
| get_date_Ymd()           | 获取年月日       | 2021-04-17                                       |
| add_date(input, times)   | 日期相加         | input: 2021-04-17 times=1  ==> output:2021-04-18 |
| minus_date(input, times) | 日期相减         | input: 2021-04-17 times=1  ==> output:2021-04-16 |
{:.mbtablestyle}

### UUID类

使用场景: 请求参数生成唯一ID

| 函数依赖包               | 函数依赖包                   | eg.示例    |
| ------------------------ | ---------------------------- | ---------- |
| random_length_string(10) | 随机生成指定长度的字符串uuid | qwertyuips |
{:.mbtablestyle}

### 查询数据库

使用场景: 数据库增删改查

| select_common(dburl, sql, type, row, column) | select方法使用,row是游标从0开始 | ${select_common($urm_db_url, $sql, oracle, 0, AT_START_dt)} |
| -------------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| select_common(dburl, sql, type)              | insert、update、delete使用      | ${select_common($urm_db_url, $sql, oracle)}                 |
{:.mbtablestyle}

### 操作redis

| redis_str(nodes, method, key, value=None, expire=None) | 操作redis数据库 | redis_str(nodes, method, key) |
| ------------------------------------------------------ | --------------- | ----------------------------- |
|                                                        |                 |                               |
{:.mbtablestyle}

### 生成证件号

| 自定义函数 | createIdcard()              | 生成身份证号           |
| ---------- | --------------------------- | ---------------------- |
| 自定义函数 | create_phone()              | 生成手机号             |
| 自定义函数 | creste_bank_card(bank_name) | 生成农商或交通银行卡号 |
{:.mbtablestyle}