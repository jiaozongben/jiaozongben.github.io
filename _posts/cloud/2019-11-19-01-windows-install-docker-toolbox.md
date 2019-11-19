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

稍等一会，这里就是安装完成了。

登录docker账户

```shell
docker login 10.164.204.195:18080
```

你的用户名密码到http://10.164.204.195:18080 注册

显示succeed到这里就算docker安装完成了。

