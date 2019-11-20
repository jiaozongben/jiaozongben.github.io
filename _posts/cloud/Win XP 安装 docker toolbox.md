---
title: Win XP 安装 docker toolbox
layout: post
no-post-nav: true
category: cloud
tags: [docker]
excerpt: docker

---



意义：本地安装docker为了打包调试方便

登录docker官网，下载并安装 [DockerToolbox-18.09.3.exe](https://github.com/docker/toolbox/releases/download/v18.09.3/DockerToolbox-18.09.3.exe)

继续下载docker系统文件 https://github.com/boot2docker/boot2docker/releases/download/v18.09.3/boot2docker.iso

一直下一步安装完成后，把boot2docker.iso放置到对应的目录

```
C:\Users\User\.docker\machine\cache\boot2docker.iso
```

打开cmd命令行,创建带环境变量的虚拟机

```shell
docker-machine create -d virtualbox --engine-insecure-registry=10.164.204.195:18080  default
```

![1574176392899](C:\Users\User\AppData\Roaming\Typora\typora-user-images\1574176392899.png)

稍等一会，这里就是安装完成了。

输入docker ps 如果报错的话

```
error during connect: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.37/containers
/json: open //./pipe/docker_engine: The system cannot find the file specified. I
n the default daemon configuration on Windows, the docker client must be run ele
vated to connect. This error may also indicate that the docker daemon is not run
ning.
```

执行这个命令

```shell
 docker-machine env
 @FOR /f "tokens=*" %i IN ('docker-machine env') DO @%i
```

注册harbor账户：http://10.164.204.195:18080

登录docker账户

```shell
docker login 10.164.204.195:18080
```

输入用户名密码



到这里就算docker安装完成了。

微服务样例代码仓库：

```
git clone http://10.164.194.139:18080/jiaozongben/docker-microservices.git
```

