---
layout: post
title:  Docker快速入门
no-post-nav: true
category: docker
tags: [Docker]
excerpt: Docker
---

# Docker快速入门

## 介绍

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中,然后发布到任何流行的[Linux](https://baike.baidu.com/item/Linux)机器上,也可以实现虚拟化,容器是完全使用沙箱机制,相互之间不会有任何接口，而且容器性能开销极低。

## 应用场景

- Web 应用的自动化打包和发布。
- 自动化测试和持续集成、发布。
- 在服务型环境中部署和调整数据库或其他的后台应用。
- 搭建自己的 PaaS 环境。

## Docker 的优点

- 简化程序：Docker 让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，便可以实现虚拟化。Docker改变了虚拟化的方式，使开发者可以直接将自己的成果放入Docker中进行管理。方便快捷已经是 Docker的最大优势，过去需要用数天乃至数周的 任务，在Docker容器的处理下，只需要数秒就能完成。
- 避免选择恐惧症：如果你有选择恐惧症，还是资深患者。那么你可以使用 Docker 打包你的纠结！比如 Docker 镜像；Docker 镜像中包含了运行环境和配置，所以 Docker 可以简化部署多种应用实例工作。比如 Web 应用、后台应用、数据库应用、大数据应用比如 Hadoop 集群、消息队列等等都可以打包成一个镜像部署。
- 节省开支：一方面，云计算时代到来，使开发者不必为了追求效果而配置高额的硬件，Docker 改变了高性能必然高价格的思维定势。Docker 与云的结合，让云空间得到更充分的利用。不仅解决了硬件管理的问题，也改变了虚拟化的方式。

## Docker Helloworld

```bash
$ docker run ubuntu:15.10 /bin/echo "Hello world"
Hello world
```

各个参数解析：

- **docker:** Docker 的二进制执行文件。
- **run:**与前面的 docker 组合来运行一个容器。
- **ubuntu:15.10**指定要运行的镜像，Docker首先从本地主机上查找镜像是否存在，如果不存在，Docker 就会从镜像仓库 Docker Hub 下载公共镜像。
- **/bin/echo "Hello world":** 在启动的容器里执行的命令

### 运行交互式的容器

```bash
$ docker run -i -t ubuntu:15.10 /bin/bash
root@8d363744da19:/#
```

各个参数解析：

- **-t:**在新容器内指定一个伪终端或终端。
- **-i:**允许你对容器内的标准输入 (STDIN) 进行交互。

此时我们已进入一个 ubuntu15.10系统的容器

我们尝试在容器中运行命令 **cat /proc/version**和**ls**分别查看当前系统的版本信息和当前目录下的文件列表

我们可以通过运行exit命令或者使用CTRL+D来退出容器。

### 查看docker版本

```bash
docker version
```

### 查看容器

```bash
docker ps
```

### 查看容器日志

```bash
 docker logs ${containerID} -f 
```

### 停止容器

```bash
docker stop ${containerID}
```

### 删除容器

```bash
docker rm ${containerID} -f  
```

### 拉取镜像

```bash
docker image pull library/hello-world
```

### 运行镜像

```bash
docker run hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.
... ...
```

## Docker常用命令

### 节点打标签

​	注：这里一旦替换掉已经在使用的标签，节点为变换为未分配而挂掉。

```
docker node update --label-add role=cold worker1
```

### 节点删除标签

```
docker node update --label-rm role worker1
```

### 写Dockerfile基础镜像

```
FROM elasticsearch:6.4.0
MAINTAINER JamesBond <jiaozongben@gmail.com>
RUN mkdir -p /usr/share/elasticsearch/plugins/repository-hdfs
COPY repository-hdfs-6.4.0.zip /usr/share/elasticsearch/plugins/repository-hdfs/repository-hdfs-6.4.0.zip
RUN cd /usr/share/elasticsearch/plugins/repository-hdfs && unzip repository-hdfs-6.4.0.zip
RUN ls /usr/share/elasticsearch/plugins/repository-hdfs
```

### 构建镜像带标签

```
docker build  -t elasticsearch-hdfs:v6.4.0 .
```

### 进入容器

```
docker exec -it containerId/Name bash
```

### 停用全部容器

```
docker stop $(docker ps -q)
```

### 删除全部容器

```
docker rm -f $(docker ps -a |  grep "zhy*"  | awk '{print $1}')
docker rm -f $(docker ps -a | awk '{print $1}')
```

### 一条命令实现停用并删除容器

```
docker stop $(docker ps -q) & docker rm $(docker ps -aq)
```

### 删除无用的镜像

```
docker rmi -f  `docker images | grep '<none>' | awk '{print $3}'` 
```



## 参考链接：

菜鸟教程: <https://www.runoob.com/docker/docker-container-usage.html>