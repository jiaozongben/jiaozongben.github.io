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
- [boot2docker.iso](https://github.com/boot2docker/boot2docker/releases/download/v18.09.3/boot2docker.iso)

### 安装docker

![img](http://jiaozongben.github.io/assets/images/cloud/admin_install_dockertoolbox.png)

**右键使用管理员权限**安装DockerToolbox

boot2docker.iso放置到cache下，**如果没有目录请手动创建**。

```
C:\Users\User\.docker\machine\cache\boot2docker.iso
```

![img](http://jiaozongben.github.io/assets/images/cloud/image_position.png)



#### 创建带环境变量的虚拟机

启动docker，打开桌面docker quickstart

![](http://jiaozongben.github.io/assets/images/cloud/docker_quickstart.png)

1.启动docker，打开桌面docker quickstart，等待就安装完成了。

![](https://jiaozongben.github.io/assets/images/cloud/docker_machine-quickstart.png)

2.打开git cmd命令行,进入到docker虚拟机修改http直连docker仓库



```shell
docker-machine ssh default
sudo vi /var/lib/boot2docker/profile  ###修改文件
--label provider=virtualbox
--insecure-registry=10.164.204.195:18080  ###加入的一行
sudo /etc/init.d/docker restart
```



![](https://jiaozongben.github.io/assets/images/cloud/docker_machineinsecure_registry.png)





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

## 推送docker镜像

代码样例gitlab： http://10.164.194.139:18080/jiaozongben/docker-microservices.git

Dockerfile

![](http://jiaozongben.github.io/assets/images/cloud/dockerfile.png)

eureka 注册中心地址改为 ,绑定环境变量 DEFAULT_ZONE导入地址

![](httpS://jiaozongben.github.io/assets/images/cloud/eureka_config.png)

## 部署服务

### 容器编排

deployment.yaml

![](httpS://jiaozongben.github.io/assets/images/cloud/k8s_deployment.png)

image： 换成自己的应用镜像

account 全局替换成 自己服务的名字

port： 2222 应用端口全局替换成应用运行的端口

环境变量： env就是绑定的环境变量

从容器云平台配置中心 eureka-cm 中取值，挂载到应用的环境变量上，每套环境都配一样的域名，会解析到对应的eureka ip

查看容器云平台配置的映射

![](http://jiaozongben.github.io/assets/images/cloud/eureka_cm.png)

### 登陆加密文件配置

#### kube配置文件

kubernetes 加密访问 config 文件 放到home目录的.kube 文件夹下面，没有目录的话cmd 手动mkdir 创建目录

![](http://jiaozongben.github.io/assets/images/cloud/kube_config.png)

#### 连接工具

kubectl、kubefwd 放到环境变量里面

![](http://jiaozongben.github.io/assets/images/cloud/k8s_env_tools.png)

### 部署微服务到云平台

在镜像推送到镜像仓库后，

就通过 命令行 

```
kubectl -f ${部署文件} -n ${namespace}
```

![](http://jiaozongben.github.io/assets/images/cloud/kubectl_deploy.png)

