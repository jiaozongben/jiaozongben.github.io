---
layout: post
title:  接口测试-查询类用例设计基础(一)
no-post-nav: false
category: api-test
tags: [api-test]
excerpt: 接口测试
---



## 接口测试-查询类用例设计基础

### 登录使用信息

#### 登录

云桌面内登录 接口测试平台，用户名密码同ldap 用户名密码

```
http://10.164.204.153:5000
```

#### 维护环境变量

原则： 约定大于配置

##### 应用、数据库信息维护

![image-20210417171613857](https://james-xuande.github.io/assets/images/image-20210417171613857.png)



### Api管理

 进入自己项目  Api信息管理-搜索要测试的api

![image-20210417122725350](https://james-xuande.github.io/assets/images/image-20210417122725350.png)



#### 接口文档

​	Get接口：拿着活动码值查询接口活动详情（包含开始时间、结束时间、状态等详情信息）

![image-20210417123530339](https://james-xuande.github.io/assets/images/image-20210417123530339.png)

​	

#### 接口测试用例

切换到测试用例页面，点击编辑开始编写测试用例，这里会把大家发布到测试环境 的接口自动生成测试用例代码（需接入Swagger标准化）

![image-20210417122841659](https://james-xuande.github.io/assets/images/image-20210417122841659.png)

#### 接口详细设计

查询类接口测试用例详细设计

![image-20210417124612775](https://james-xuande.github.io/assets/images/image-20210417124612775.png)



### 用例实现



#### 动态查询(动态查询数据库)

##### 步骤一: 测试数据准备

​	请求数据中**活动码如何从数据库动态查询**，每次测试都是查询不同的活动码：

![image-20210417130429203](https://james-xuande.github.io/assets/images/image-20210417130429203.png)

```
act_ct_sql=select count(1) as CT from F_MA_ACT_INFO 
ct=${select_common($urm_db_url, $act_ct_sql, oracle, 0, CT)}
row=${randomint($ct)}
code_sql=select AT_CODE ,AT_START_DT, AT_STATUS from F_MA_ACT_INFO f
actCode=${select_common($urm_db_url, $code_sql, oracle, $row, AT_CODE)}
sql=select AT_START_DT,AT_END_DT,AT_STATUS from F_MA_ACT_INFO f where AT_CODE=$actCode
```

##### 步骤二: 测试用例运行

- 这个时候我们点测试，请求结果，是能获取到对应动态活动码 请求接口了：

![image-20210417130835386](https://james-xuande.github.io/assets/images/image-20210417130835386.png)

- 测试报告查看

![image-20210417131040325](https://james-xuande.github.io/assets/images/image-20210417131040325.png)

点击log，对于本次请求：

![image-20210417131409676](https://james-xuande.github.io/assets/images/image-20210417131409676.png)

##### 步骤三: 用例双向校验

- （返回报文<-->数据库）

![image-20210417160125614](https://james-xuande.github.io/assets/images/image-20210417160125614.png)





- 这里在返回体提取出本次的返回体变量后，用于和数据库的值进行校验

![image-20210417131643311](https://james-xuande.github.io/assets/images/image-20210417131643311.png)

```
status_code==200 
content.head.retFlag==00000
content.head.retMsg==处理成功
content.body.startDt==${select_common($urm_db_url, $sql, oracle, 0, AT_START_dt)}
content.body.endDt==${select_common($urm_db_url, $sql, oracle, 0, AT_END_DT)}
content.body.atStatus==${select_common($urm_db_url, $sql, oracle, 0, AT_STATUS)}
```





#### 前置后置

##### 数据准备之前

这里根据你的需求，有时候是**准备数据之前**要执行 setup操作

![image-20210417170616223](https://james-xuande.github.io/assets/images/image-20210417170616223.png)

```
sql="insert 一条你想要的数据"
${select_common($urm_db_url, $sql, oracle)}
```



##### 接口调用之前

这里根据你的需求，有时候是**准备数据之后**，再执行setup操作

```
sql="insert 一条你想要的数据"
${select_common($urm_db_url, $sql, oracle)}
```

![image-20210417171103875](https://james-xuande.github.io/assets/images/image-20210417171103875.png)

##### 断言执行之后

测试后置的执行顺序 在 **断言校验之后**，也就是说比对完结果， 就会清理数据库中本条无用数据。

```
sql="delete 一条你不想要的数据"
${select_common($urm_db_url, $sql, oracle)}
```

![image-20210417170935361](https://james-xuande.github.io/assets/images/image-20210417170935361.png)





### 持续集成

当您写好一条用例的时候，可以联系我给您配置上自动测试脚本了，我们已经打通jenkins、钉钉，发布后钉钉就会收到自动测试的报告，持续拿到回归测试收益。



