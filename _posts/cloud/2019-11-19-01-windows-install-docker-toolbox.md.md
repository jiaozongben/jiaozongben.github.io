---
title: Win 7 安装 docker toolbox
layout: post
no-post-nav: true
category: cloud
tags: [docker]
excerpt: docker

---



意义：本地安装docker为了打包调试方便

## 客户端配置

### 准备安装包

- [DockerToolbox-18.09.3.exe](https://github.com/docker/toolbox/releases/download/v18.09.3/DockerToolbox-18.09.3.exe)
-  https://github.com/boot2docker/boot2docker/releases/download/v18.09.3/boot2docker.iso

### 安装docker

![img](http://jiaozongben.github.io/assets/images/cloud/admin_install_dockertoolbox.png)

**右键使用管理员权限**安装安装DockerToolbox

boot2docker.iso放置到cache下

```
C:\Users\User\.docker\machine\cache\boot2docker.iso
```

![img](http://jiaozongben.github.io/assets/images/cloud/image_position.png)



#### 创建带环境变量的虚拟机

打开docker cmd命令行,创建带环境变量的虚拟机，-d 静默运行 --engine-insecure-registry 指定镜像仓库

```shell
docker-machine create -d virtualbox --engine-insecure-registry=10.164.204.195:18080  default
```

![](https://jiaozongben.github.io/assets/images/cloud/create_machine.png)

稍等一会，这里就是安装完成了。

启动docker，打开桌面docker quickstart

![](http://jiaozongben.github.io/assets/images/cloud/docker_quickstart.png)

![](https://jiaozongben.github.io/assets/images/cloud/docker_login.png)

### 注册docker账户

http://10.164.204.195:18080

![](https://jiaozongben.github.io/assets/images/cloud/harbor_login.png)

<https://jiaozongben.github.io/assets/images/cloud/harbor_login.png>

#### 客户端登陆docker

windows cmd登录docker账户

```shell
docker login 10.164.204.195:18080
```

输入用户名密码

到这里docker本地环境安装完成。

### idea 安装docker 插件

idea plugin 下载docker 插件，没有的话去idea plugin中心下载docker

![](https://jiaozongben.github.io/assets/images/cloud/idea_download_docker_plugin.png)

![](https://jiaozongben.github.io/assets/images/cloud/idea_docker_service.png)

![](https://jiaozongben.github.io/assets/images/cloud/idea_docker_plugin.png)

显示connection successful就是配置好了





## 推送docker镜像

代码样例gitlab： http://10.164.194.139:18080/jiaozongben/docker-microservices.git

Dockerfile

![](http://jiaozongben.github.io/assets/images/cloud/dockerfile.png)

eureka 注册中心地址改为 ,绑定环境变量 DEFAULT_ZONE导入地址

![](httpS://jiaozongben.github.io/assets/images/cloud/eureka_config.png)

## 部署服务

deployment.yaml

![](httpS://jiaozongben.github.io/assets/images/cloud/k8s_deployment.png)

这里image换成自己的应用镜像

account 全局替换成 自己服务的名字

2222 应用端口全局替换称自己的端口