---
layout: post
title:  接口测试-参数提取-回调方式讲解
no-post-nav: false
category: api-test
tags: [api-test]
excerpt: 接口测试


---




## 接口测试-参数提取-回调方式讲解

有一些回调接口的报文，我们直接请求可能拿不到相关的报文，需要将回调报文落到数据库，然后再进行测试，这就涉及到多个数据库之间进行数据的比对，本次以变量中心的 variable_platform_rhzx_测试人行征信回调 用例为例，讲一下参数提取在测试接口回调情况的作用。

- 1、人行征信接口会调用测试平台的mock接口，将回调报文落入的我们的数据库。

  ![call_back_response](https://james-xuande.github.io/images/posts/2021-04-22/call_back_response.png)

- 2、断言两边均支持引用参数提取的变量，引用方式为 #变量名.校验字段。

  ![validate_both](https://james-xuande.github.io/images/posts/2021-04-22/validate_both.png)



