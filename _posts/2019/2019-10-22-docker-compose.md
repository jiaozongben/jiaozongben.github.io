---
layout: post
title:  Docker Swarm入门
no-post-nav: true
category: docker
tags: [Docker]
excerpt: Docker
---

# Docker Compose快速入门

* 目录  
{:toc #markdown-toc}

## 介绍

Docker Swar是Docker 容器集群服务，是 Docker 官方对容器云生态进行支持的核心方案，使用它，用户可以将多个 Docker 主机封装为单个大型的虚拟 Docker 主机，快速打造一套容器云平台。

## 安装

```
yum install docker-compose
```

## 快速开始

这里快速搭建一套kafka集群,每台机器打了标签kakfa

### kafka.yaml

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

### 启动命令：

```
docker stack deploy -c kafka.yml  kafka
```

