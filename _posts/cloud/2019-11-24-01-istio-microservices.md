---
title: Istio 服务网格
layout: post
no-post-nav: true
category: cloud
tags: [ServiceMesh]
excerpt: docker

---

# 微服务-服务网格

<https://istio.io/docs/concepts/what-is-istio/>

## 4个特性

### Traffic Management

#### Request Routing

根据请求报文，做多个版本的服务路由

<https://istio.io/docs/tasks/traffic-management/request-routing/>

- `productpage` → `reviews:v2` → `ratings` (only for user `jason`)
- `productpage` → `reviews:v1` (for everyone else)

#### Fault Injection

错误注入功能，测试鲁棒性 

- 延迟
- http返回码

#### Traffic Shifting

百分比流量切换

#### Circuit Breaking

断路器，超过连接数，断开连接

#### Mirroring

镜像流量

#### Ingress网关

4-6配置端口匹配

<https://istio.io/docs/tasks/traffic-management/ingress/ingress-control/>



### Security

### Policies

#### 限制速率

#### 控制报文头和路由

#### 黑白名单

##### 基于属性的名单

##### 基于IP的名单

### Observability

#### 指标

监控并可视化

<https://istio.io/docs/tasks/observability/metrics/using-istio-dashboard/>

#### 日志

##### EFK

<https://istio.io/docs/tasks/observability/logs/fluentd/>

#### 分布式追踪

[Jaeger](https://istio.io/docs/tasks/observability/distributed-tracing/jaeger/)

[Zipkin](https://istio.io/docs/tasks/observability/distributed-tracing/zipkin/)

##### LightStep