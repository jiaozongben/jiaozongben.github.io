---
title: 容器云平台-微服务集成手册
layout: post
no-post-nav: true
category: cloud
tags: [kubernetes,rancher,pipeline,docker]
excerpt: kubernetes
---



完成三个文件编写(Dockerfile、.rancher-pipeline.yml、deployment.yaml)、并验证

## 01.应用容器化

### 构建镜像

将Dockerfile放在项目根目录

Dockerfile

```
FROM 10.164.204.195:18080/base/jdk8:stable
VOLUME /tmp
ADD check-server/check-server/build/libs/check-server-1.1.2-SNAPSHOT-exec.jar /app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
```

### 镜像仓库

登录镜像仓库地址 http://10.164.204.195:18080

请注册用户名密码

## 02.构建流水线

**项目master权限才能配置 流水线，devlope权限只能执行。**

流水线配置，将.rancher-pipeline.yml放在项目根目录

.rancher-pipeline.yml

```
stages:
- name: compile
  steps:
  - runScriptConfig:
      image: 10.164.204.195:18080/base/gradle:stable
      shellScript: 'gradle clean build -x test -Pprofile=dev'
- name: publish
  steps:
  - publishImageConfig:
      dockerfilePath: ./check-server/check-server/Dockerfile
      buildContext: .
      tag: pgw/check:${CICD_EXECUTION_SEQUENCE}
      pushRemote: true
      registry: 10.164.204.195:18080
    env:
      PLUGIN_DEBUG: "true"
      PLUGIN_INSECURE: "true"
timeout: 60
notification:
  recipients:
  - recipient: app
    notifier: local:n-x5zl2
  condition:
  - Success
  - Changed
  - Failed
```

## 03.容器编排

kubernetes容器编排编写，放在项目根目录

deployment.yaml

```
kind: Service
apiVersion: v1
metadata:
  name: check-service
spec:
  selector:
    app: check
  type: NodePort
  ports:
    - protocol: TCP
      port: 8086
      targetPort: 8086
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-check
  labels:
    app: check
spec:
  replicas: 1
  selector:
    matchLabels:
      app: check
  template:
    metadata:
      labels:
        app: check
    spec:
      imagePullSecrets:
      - name: pipeline-docker-registry
      containers:
      - name: check
        image: ${CICD_IMAGE}:${CICD_EXECUTION_SEQUENCE}
        ports:
        - containerPort: 8086
        env:
          - name: DEFAULT_ZONE
            valueFrom:
              configMapKeyRef:
                name: eureka-cm
                key: eureka_service_address
```

## 登录云平台

https://www.rancher.haiercloud.com/

测试用户名 guest

密码 guest