---
layout: post
title:  接口测试-参数提取-优化性能
no-post-nav: false
category: api-test
tags: [api-test]
excerpt: 接口测试


---



## 接口测试-参数提取-优化性能



在设计测试用例过程中，经常会遇到这样一个问题：调用接口成功之后返回字段过多。如果想对所有字段都进行校验，每检验一个字段就要查询一次数据库，如果这种用例运行次数过多，就会对测试平台，数据库服务器产生影响。为解决相关问题，我们从参数提取这块讲一讲如何进行性能优化。

以cmis-query-server系统-110300-查询还款方式-根据等额本息查询用例为例：

- 1、110300的接口正常的返回报文如下图所示，大概有三十多个返回字段。

![api_response](https://james-xuande.github.io/images/posts/2021-04-22/api_response.png)

- 2、为了优化性能，我们在参数提取这，执行自定义函数将校验的数据一次性查出，并使用一个变量来接收。

  ![get_row](https://james-xuande.github.io/images/posts/2021-04-22/get_row.png)

- 3、在断言校验中，可以引用参数提取中查询回来的变量，引用方式为 #变量名.校验参数。

  ![validate_](https://james-xuande.github.io/images/posts/2021-04-22/validate_.png)

- 4、通过校验字段直接引用的方式，把30多个事务优化为1个事务，极大的提高了用例执行效率。





