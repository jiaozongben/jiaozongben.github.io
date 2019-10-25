---
layout: post
title:  容器化(02):零基础入门Docker
no-post-nav: true
category: docker
tags: [Docker]
excerpt: Docker
---



## 介绍

Docker是一个虚拟环境容器，可以将你的开发环境、代码、配置文件等一并打包到这个容器中，并发布和应用到任意平台中。

## Docker的三个概念

- 镜像（Image）：类似于虚拟机中的镜像，是一个包含有文件系统的面向Docker引擎的只读模板。任何应用程序运行都需要环境，而镜像就是用来提供这种运行环境的。

- 容器（Container）：类似于一个轻量级的沙盒，可以将其看作一个极简的Linux系统环境（包括root权限、进程空间、用户空间和网络空间等），以及运行在其中的应用程序。Docker引擎利用容器来运行、隔离各个应用。容器是镜像创建的应用实例，可以创建、启动、停止、删除容器，各个容器之间是是相互隔离的，互不影响。注意：镜像本身是只读的，容器从镜像启动时，Docker在镜像的上层创建一个可写层，镜像本身不变。

- 仓库（Repository）：类似于代码仓库，这里是镜像仓库，是Docker用来集中存放镜像文件的地方。

### 镜像的基本操作

安装完Docker引擎之后，就可以对镜像进行基本的操作了。

我们从官方注册服务器（[https://hub.docker.com](https://link.zhihu.com/?target=https%3A//hub.docker.com)）的仓库中pull下CentOS的镜像，前边说过，每个仓库会有多个镜像，用tag标示，如果不加tag，默认使用latest镜像：

```bash
[root@xxx ~]# docker search centos    # 查看centos镜像是否存在
[root@docker04 yum.repos.d]# docker pull centos # 利用pull命令获取镜像
Using default tag: latest
latest: Pulling from library/centos
729ec3a6ada3: Pull complete
Digest: sha256:f94c1d992c193b3dc09e297ffd54d8a4f1dc946c37cbeceb26d35ce1647f88d9
Status: Downloaded newer image for centos:latest

[root@docker04 yum.repos.d]# docker images # 查看当前系统中的images信息
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
centos              latest              0f3e07c0138f        3 weeks ago         220MB
```

以上是下载一个已有镜像，此外有两种方法可以帮助你新建自有镜像。

（1）利用镜像启动一个容器后进行修改 ==> 利用commit提交更新后的副本

```text
[root@xxx ~]# docker run -it centos:latest /bin/bash    # 启动一个容器
[root@72f1a8a0e394 /]#    # 这里命令行形式变了，表示已经进入了一个新环境
[root@72f1a8a0e394 /]# git --version    # 此时的容器中没有git
bash: git: command not found
[root@72f1a8a0e394 /]# yum install git    # 利用yum安装git
......
[root@72f1a8a0e394 /]# git --version   # 此时的容器中已经装有git了
git version 1.8.3.1
```

此时利用exit退出该容器，然后查看docker中运行的程序（容器）：

```
[root@xxx ~]# docker ps -a
CONTAINER ID  IMAGE    COMMAND      CREATED   STATUS   PORTS    NAMES
72f1a8a0e394  centos:latest "/bin/bash"  9 minutes ago   Exited (0) 3 minutes ago  
```

这里将容器转化为一个镜像，即执行commit操作，完成后可使用docker images查看：

```
[root@xxx ~]# docker commit -m "centos with git" -a "jiaozongben" 72f1a8a0e394 jiaozongben/centos:git

[root@xxx ~]# docker images
REPOSITORY       TAG    IMAGE ID         CREATED             SIZE
jiaozongben/centos    git    52166e4475ed     5 seconds ago       358.1 MB
centos           latest 0584b3d2cf6d     9 days ago          196.5 MB
```

其中，-m指定说明信息；-a指定用户信息；72f1a8a0e394代表容器的id；jiaozongben/centos:git指定目标镜像的用户名、仓库名和 tag 信息。注意这里的用户名jiaozongben，后边会用到。

此时Docker引擎中就有了我们新建的镜像jiaozongben/centos:git，此镜像和原有的CentOS镜像区别在于多了个Git工具。此时我们利用新镜像创建的容器，本身就自带git了。

```text
[root@xxx ~]# docker run -it jiaozongben/centos:git /bin/bash
[root@520afc596c51 /]# git --version
git version 1.8.3.1
```

利用exit退出容器。注意此时Docker引擎中就有了两个容器，可使用docker ps -a查看。

（2）利用Dockerfile创建镜像

Dockerfile可以理解为一种配置文件，用来告诉docker build命令应该执行哪些操作。一个简易的Dockerfile文件如下所示，官方说明：[Dockerfile reference](https://link.zhihu.com/?target=https%3A//docs.docker.com/engine/reference/builder/)：

```text
# 说明该镜像以哪个镜像为基础
FROM centos:latest

# 构建者的基本信息
MAINTAINER jiaozongben

# 在build这个镜像时执行的操作
RUN yum update
RUN yum install -y git

# 拷贝本地文件到镜像中
COPY ./* /usr/share/gitdir/
```



有了Dockerfile之后，就可以利用build命令构建镜像了：

```text
[root@xxx ~]# docker build -t="jiaozongben/centos:gitdir" .
```

其中-t用来指定新镜像的用户信息、tag等。最后的点表示在当前目录寻找Dockerfile。

构建完成之后，同样可以使用docker images命令查看：

```
[root@xxx ~]# docker images
REPOSITORY        TAG       IMAGE ID      CREATED            SIZE
jiaozongben/centos     gitdir    0749ecbca587  34 minutes ago     359.7 MB
jiaozongben/centos     git       52166e4475ed  About an hour ago  358.1 MB
centos            latest    0584b3d2cf6d  9 days ago         196.5 MB
```

以上就是构建自己镜像的两种方法。其中也涉及到了容器的一些操作。如果想删除容器或者镜像，可以使用rm命令，注意：删除镜像前必须先删除以此镜像为基础的容器。

```text
[root@xxx ~]# docker rm container_name/container_id
[root@xxx ~]# docker rmi image_name/image_id
```

镜像其他操作指令：

```reStructuredText
[root@xxx ~]# docker save -o centos.tar jiaozongben/centos:git    # 保存镜像, -o也可以是--output
[root@xxx ~]# docker load -i centos.tar    # 加载镜像, -i也可以是--input
```

### 容器的基本操作

在前边镜像的章节中，我们已经看到了如何基于镜像启动一个容器，即docker run操作。

```text
[root@xxx ~]# docker run -it centos:latest /bin/bash
```

这里-it是两个参数：-i和-t。前者表示打开并保持stdout，后者表示分配一个终端（pseudo-tty）。此时如果使用exit退出，则容器的状态处于Exit，而不是后台运行。如果想让容器一直运行，而不是停止，可以使用快捷键 ctrl+p ctrl+q 退出，此时容器的状态为Up。

除了这两个参数之外，run命令还有很多其他参数。其中比较有用的是-d后台运行：

```text
[root@xxx ~]# docker run centos:latest /bin/bash -c "while true; do echo hello; sleep 1; done"
[root@xxx ~]# docker run -d centos:latest /bin/bash -c "while true; do echo hello; sleep 1; done"
```

这里第二条命令使用了-d参数，使这个容器处于后台运行的状态，不会对当前终端产生任何输出，所有的stdout都输出到log，可以使用docker logs container_name/container_id查看。

启动、停止、重启容器命令：

```
[root@xxx ~]# docker start container_name/container_id
[root@xxx ~]# docker stop container_name/container_id
[root@xxx ~]# docker restart container_name/container_id
```

后台启动一个容器后，如果想进入到这个容器，可以使用attach命令：

```text
[root@xxx ~]# docker attach container_name/container_id
```

删除容器的命令前边已经提到过了：

```text
[root@xxx ~]# docker rm container_name/container_id
```

### 仓库的基本操作

Docker官方维护了一个DockerHub的公共仓库，里边包含有很多平时用的较多的镜像。除了从上边下载镜像之外，我们也可以将自己自定义的镜像发布（push）到DockerHub上。

在镜像操作章节中，我们新建了一个jiaozongben/centos:git镜像。

（1）访问[https://hub.docker.com/](https://link.zhihu.com/?target=https%3A//hub.docker.com/)，如果没有账号，需要先注册一个。

（2）利用命令docker login登录DockerHub，输入用户名、密码即可登录成功：

```
[root@xxx ~]# docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: jiaozongben
Password:
Login Succeeded
```

（3）将本地的镜像推送到DockerHub上，这里的jiaozongben要和登录时的username一致：

```text
[root@xxx ~]# docker push jiaozongben/centos:git    # 成功推送
[root@xxx ~]# docker push xxx/centos:git    # 失败
The push refers to a repository [docker.io/xxx/centos]
unauthorized: authentication required
```

（4）以后别人就可以从你的仓库中下载合适的镜像了。

```text
[root@xxx ~]# docker pull jiaozongben/centos:git
```

对应于镜像的两种创建方法，镜像的更新也有两种：

- 创建容器之后做更改，之后commit生成镜像，然后push到仓库中。
- 更新Dockerfile。在工作时一般建议这种方式，更简洁明了。

这里再一次回顾一下三个重要的概念：镜像、容器、仓库：

> 从仓库（一般为DockerHub）下载（pull）一个镜像，Docker执行run方法得到一个容器，用户在容器里执行各种操作。Docker执行commit方法将一个容器转化为镜像。Docker利用login、push等命令将本地镜像推送（push）到仓库。其他机器或服务器上就可以使用该镜像去生成容器，进而运行相应的应用程序了。

## 实例

### 利用Docker创建一个用于Flask开发的Python环境

上边已经解释和练习了Docker的基本操作命令，下边以实例的形式完整走一遍流程。

我们创建一个用于Flask开发的Python环境，包含Git、Python3、Flask以及其他依赖包等。

完整命令如下：

```
[root@xxx ~]# docker pull centos
[root@xxx ~]# docker run -it centos:latest /bin/bash
# 此时进入容器，安装Python3、Git、Flask及其依赖包等，安装完成后exit退出
[root@xxx ~]# docker commit -m "Flask" -a "jiaozongben" container_id jiaozongben/flask:v1
[root@xxx ~]# docker push jiaozongben/flask:v1
```

## docker-compose

### 介绍

docker-compose 在**单机**中通过一个配置文件来管理多个Docker容器，在配置文件中，所有的容器通过services来定义，然后使用docker-compose脚本来启动，停止和重启应用，和应用中的服务以及所有依赖服务的容器，非常适合组合使用多个容器进行开发的场景。

### 安装

```
yum install docker-compose 
```

### 配置 dockers-compose.yml文件

```yml
version: '3'
services:
 # nginx 服务
 nginx:
  # 推荐使用官方镜像
  image: nginx:latest
  # 映射端口，把容器端口映射到宿主机对外接口，格式：对外端口:容器端口
  ports:
  - "80:80"
  - "443:443"
  # 所依赖的服务，php会先启动
  depends_on:
  - php

 # php 服务
 php:
  # 官方镜像
  image: php:7-fpm
```

docker-compose.yml是一个[YAML](https://baike.baidu.com/item/YAML/1067697?fr=aladdin)文件，语法很简单。

我们把上面的文件分解一下。在父级，我们定义服务的名称：`nginx`和`php`，`nginx`服务使用镜像`nginx:latest`，`php`服务使用镜像`php:7-fpm`。`ports`参数可以定义服务的端口映射。详细信息，请看注释。

### docker-compose启动多个容器

先确保docker服务已经运行：

```shell
$ sudo service docker start
```

运行docker-compose，切换到docker-compose.yml所在的目录执行

```shell
$ sudo docker-compose up -d
```

会自动下载nginx与php镜像，然后运行这两个容器。

### 确认容器运行

通过`docker ps`查看nginx与php容器是否运行：

```shell
[root@qikegu deploly]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                      NAMES
042328b082a4        nginx:latest        "nginx -g 'daemon of…"   33 seconds ago      Up 31 seconds       0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp   deploly_nginx_1
9d0b67f869ee        php:7-fpm           "docker-php-entrypoi…"   34 seconds ago      Up 33 seconds       9000/tcp                                   deploly_php_1
```

### 容器停止

```
docker-compose down 
```

## docker-swarm

### 介绍

Docker Swarm是Docker 容器**集群**服务，是 Docker 官方对容器云生态进行支持的核心方案，使用它，用户可以将多个 Docker 主机封装为单个大型的虚拟 Docker 主机，快速打造一套容器云平台。

### 构建集群

*// 这是集群初始化命令*

```
docker swarm init
```

### 集群部署应用

部署kafka高可用集群案例

```
/ 现在我们来运行它 你必须给你的应用程序一个名字。在这里，它设置为 kafka：
$ docker stack deploy -c docker-compose.yml kafka
```

#### 每个节点打标签

这里的worker1替换成你的节点名字

```bash
docker node ls
```

```bash
docker node update --label-add role=kafka worker1
```

#### docker-compose.yml

```
version: '3.2'
services:

  zoo1:
    image: zookeeper:3.4
    restart: always
    hostname: zoo1
    deploy:
      replicas: 1
      placement:
        constraints:                      # 添加条件约束
         - node.labels.role==kafka
    ports:
      - 2181:2181
    environment:
      ZOO_MY_ID: 1
      ZOO_SERVERS: server.1=0.0.0.0:2888:3888 server.2=zoo2:2888:3888 server.3=zoo3:2888:3888

  zoo2:
    image: zookeeper:3.4
    restart: always
    deploy:
      replicas: 1
      placement:
        constraints:                      # 添加条件约束
         - node.labels.role==kafka
    hostname: zoo2
    ports:
      - 2182:2181
    deploy:
      replicas: 1
      placement:
        constraints:                      # 添加条件约束
         - node.labels.role==kafka
    environment:
      ZOO_MY_ID: 2
      ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=0.0.0.0:2888:3888 server.3=zoo3:2888:3888

  zoo3:
    image: zookeeper:3.4
    restart: always
    deploy:
      replicas: 1
      placement:
        constraints:                      # 添加条件约束
         - node.labels.role==kafka
    hostname: zoo3
    ports:
      - 2183:2181
    environment:
      ZOO_MY_ID: 3
      ZOO_SERVERS: server.1=zoo1:2888:3888 server.2=zoo2:2888:3888 server.3=0.0.0.0:2888:3888

  kafka:
    image: wurstmeister/kafka:1.1.0
    deploy:
      replicas: 3
      placement:
        constraints:                      # 添加条件约束
         - node.labels.role==kafka  
    ports:
      - target: 9094
        published: 9094
        protocol: tcp
        mode: host  
    environment:
      HOSTNAME_COMMAND: "docker info | grep ^Name: | cut -d' ' -f 2 "
      KAFKA_ZOOKEEPER_CONNECT: zoo1:2181,zoo2:2181,zoo3:2181
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INSIDE:PLAINTEXT,OUTSIDE:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: INSIDE://:9092,OUTSIDE://_{HOSTNAME_COMMAND}:9094
      KAFKA_LISTENERS: INSIDE://:9092,OUTSIDE://:9094
      KAFKA_INTER_BROKER_LISTENER_NAME: INSIDE
      KAFKA_LOG_RETENTION_BYTES: -1
      KAFKA_LOG_RETENTION_DAYS: 3 
    volumes:
      - /data/kafka:/kafka     
      - /var/run/docker.sock:/var/run/docker.sock
  

  kafka-manager:
    image: sheepkiller/kafka-manager:1.3.0.4
    ports:
    - "9000:9000"
    environment:
    - ZK_HOSTS=zoo1:2181,zoo2:2181,zoo3:2181     
    volumes:
    - /var/run/docker.sock:/var/run/docker.sock            
```



## Docker常用命令

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

docker官方文档： <https://docs.docker.com/>

只要一小时，零基础入门Docker：<https://zhuanlan.zhihu.com/p/23599229>