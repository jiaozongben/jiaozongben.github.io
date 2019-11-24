---
layout: post
title:  容器化(03):容器云Rancher2.2安装部署
no-post-nav: true
category: docker
tags: [kubernetes,k8s,rancher]
excerpt: k8s
---

# Rancher2.3.2 RKE HA离线搭建集群

官方链接 <https://www.rancher.cn/docs/rancher/v2.x/cn/installation/air-gap-installation/ha/>



## 搭建rancher server

请先根据官方链接配置好所有 前置条件。

要求（列出大致要求，具体步骤特别是docker安装部分参照上面的基础环境配置）:
- CPU: 4C；
- 内存:8G以上；
- Centos/RedHat Linux 7+(64位);
- Docker 18.03；（用其他版本的立马重新装吧）
- 配好主机名和host，关防护墙和selinux；（/etc/hosts和/etc/hostname）
- 配置Docker镜像加速地址等信息 /etc/docker/daemon.json，如下代码
- 使用非root账户
- 主机名只支持包含 - 和 .(中横线和点)两种特殊符号，不能重复

**HA安装需求(标准3节点)**

| **部署规模** | 集群数     | Nodes       | vCPUs                                           | RAM                                             |
| ------------ | ---------- | ----------- | ----------------------------------------------- | ----------------------------------------------- |
| 小           | 最多5个    | 最多50个    | 2                                               | 8 GB                                            |
| 中           | 最多15个   | 最多200个   | 4                                               | 16 GB                                           |
| 大           | 最多50个   | 最多500个   | 8                                               | 32 GB                                           |
| 大+          | 最多100个  | 最多1000个  | 32                                              | 128 GB                                          |
| 大++         | 超过100+个 | 超过1000+个 | [联系 Rancher](https://www.rancher.cn/contact/) | [联系 Rancher](https://www.rancher.cn/contact/) |

 创建 /etc/docker/daemon.json  

```
cat >> /etc/docker/daemon.json<<EOF
{
  "oom-score-adjust": -1000,
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
     "max-file": "3"
  },
   "max-concurrent-downloads": 10,
   "max-concurrent-uploads": 10,
   "bip": "169.254.123.1/24",
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ],
 "registry-mirrors": [ "https://v0ukz93w.mirror.aliyuncs.com"],
 "insecure-registries": ["10.164.204.195:18080"]
}
EOF
```



- 创建第一个集群 [搭设集群](https://www.cnrancher.com/docs/rancher/v2.x/cn/overview/quick-start-guide/#top)

| IP             | 角色          |
| -------------- | ------------- |
| 10.164.194.120 | nginx         |
| 10.164.204.153 | deploy server |
| 10.164.204.47  | master & node |
| 10.164.204.48  | master & node |
| 10.164.204.49  | master & node |

### 配置前置nginx

前面的nginx配置域名请参考官网

生成秘钥

```
./create_self-signed-cert.sh --ssl-domain=www.rancher.haiercloud.com    --ssl-trusted-domain=www.haiercloud.com   \
 --ssl-trusted-ip=10.164.194.120,10.164.204.47,10.164.204.48,10.164.204.49 --ssl-size=2048 --ssl-date=3650
```

先看配置的rancher域名是否可以访问

```
nslookup www.rancher.haiercloud.com
dig @10.164.204.153  haiercloud.com
```



### rancher配置文件

rancher-cluster.yml

```
nodes:
  - address: 10.164.204.47    
    internal_address:
    hostname_override: docker01      
    user: rancher
    role:
      - controlplane
      - etcd
      - worker    
  - address: 10.164.204.48    
    internal_address:
    hostname_override: docker02
    user: rancher
    role:
      - controlplane
      - etcd
      - worker  
  - address: 10.164.204.49    
    internal_address:
    hostname_override: docker03
    user: rancher
    role:
      - controlplane
      - etcd
      - worker  
    labels:
      app: ingress
      app: dns

#  - address: 10.164.204.50
#    internal_address:
#    hostname_override: docker04
#    user: rancher
#    role:
#      - worker


# 如果设置为true，则可以使用不受支持的Docker版本
ignore_docker_version: false


 

# 私有仓库
## 当设置`is_default: true`后，构建集群时会自动在配置的私有仓库中拉取镜像
## 如果使用的是DockerHub镜像仓库，则可以省略`url`或将其设置为`docker.io`
## 如果使用内部公开仓库，则可以不用设置用户名和密码

private_registries:
  - url: 10.164.204.195:18080
    user: rancher
    password: Aa123456!
    is_default: true


# 设置Kubernetes集群名称
cluster_name: mycluster



services:
  kube-apiserver:
    extra_args:
      feature-gates: "PersistentLocalVolumes=true,VolumeScheduling=true"
  kubelet:
    extra_args:
      feature-gates: "PersistentLocalVolumes=true,VolumeScheduling=true"
    extra_env:
      - "HTTP_PROXY=http://10.164.204.153:3128"
      - "HTTPS_PROXY=http://10.164.204.153:3128"
      - "NO_PROXY=127.0.0.1,localhost,10.0.0.0/8"
  etcd:
    # if external etcd is used
    # path: /etcdcluster
    # external_urls:
    #   - https://etcd-example.com:2379
    # ca_cert: |-
    #   -----BEGIN CERTIFICATE-----
    #   xxxxxxxxxx
    #   -----END CERTIFICATE-----
    # cert: |-
    #   -----BEGIN CERTIFICATE-----
    #   xxxxxxxxxx
    #   -----END CERTIFICATE-----
    # key: |-
    #   -----BEGIN PRIVATE KEY-----
    #   xxxxxxxxxx
    #   -----END PRIVATE KEY-----
    # Rancher 2用户注意事项：如果在创建Rancher Launched Kubernetes时使用配置文件配置集群，则`kube_api`服务名称应仅包含下划线。这仅适用于Rancher v2.0.5和v2.0.6。
    # 以下参数仅支持RKE部署的etcd集群
  
    # 开启自动备份
    ## rke版本大于等于0.2.x或rancher版本大于等于2.2.0时使用
    backup_config:
      enabled: true
      interval_hours: 12
      retention: 6
    ## rke版本小于0.2.x或rancher版本小于2.2.0时使用
    ##snapshot: true
    ##creation: 5m0s
    ##retention: 24h

    # 扩展参数
    extra_args:
      auto-compaction-retention: 240 #(单位小时)
      # 修改空间配额为$((6*1024*1024*1024))，默认2G,最大8G
      quota-backend-bytes: '6442450944'
# Kubernetes认证模式
## Use `mode: rbac` 启用 RBAC
## Use `mode: none` 禁用 认证
#authorization:
#  mode: rbac
# 如果要设置Kubernetes云提供商，需要指定名称和配置，非云主机则留空；
#cloud_provider:
#  name: 
# Add-ons是通过kubernetes jobs来部署。 在超时后，RKE将放弃重试获取job状态。以秒为单位。
addon_job_timeout: 30
# 有几个网络插件可以选择：`flannel、canal、calico`，Rancher2默认canal
#network:
#  plugin: canal
#  options:
#    flannel_backend_type: "vxlan"
# 目前只支持nginx ingress controller
## 可以设置`provider: none`来禁用ingress controller
#ingress:
#  provider: nginx
#  node_selector:
#    app: ingress
# 配置dns上游dns服务器
## 可用rke版本 v0.2.0
dns:
  provider: coredns 
  upstreamnameservers:
  node_selector:
    app: dns      
```

### RKE构建集群

这个文件要保留好，后面集群扩容还是要修改rancher-cluster.yml然后执行这个命令

```
rke up --config ./rancher-cluster.yml  # 构建rancher容器云集群
```

剩下的命令都要依次执行

#### 拷贝集群准入信息

```
cp kube_config_rancher-cluster.yml $HOME/.kube/config
```

#### 配置Helm客户端访问权限

Helm在Kubernetes集群上安装`Tiller`服务以管理charts,由于RKE默认启用RBAC, 因此我们需要使用kubectl来创建一个`serviceaccount`，`clusterrolebinding`才能让Tiller具有部署到集群的权限。

`在离线环境中安装有kubectl的主机上执行以下命令`：

```bash
$ kubectl   -n kube-system create serviceaccount tiller 

$ kubectl   \
    create clusterrolebinding tiller \
    --clusterrole cluster-admin \
    --serviceaccount=kube-system:tiller 
```

#### 创建registry secret

##### 方便从内网仓库拉取系统镜像

Helm初始化的时候会去拉取`tiller`镜像，如果镜像仓库为私有仓库，则需要配置登录凭证。在离线环境中安装有kubectl的主机上执行以下命令

```bash
kubectl   -n kube-system \
    create secret docker-registry regcred \
    --docker-server="10.164.204.195:18080" \
    --docker-username=rancher \
    --docker-password=Aa123456! \
    --docker-email=jiaozongben@haiercash.com  
```

##### Patch the ServiceAccount

```bash
$ kubectl   -n kube-system \
    patch serviceaccount tiller -p '{"imagePullSecrets": [{"name": "regcred"}]}'    
```

#### 安装Helm客户端

在离线环境中安装有kubectl的主机上安装Helm客户端，参考[安装Helm客户端](https://www.rancher.cn/docs/rancher/v2.x/cn/installation/ha-install/helm-rancher/tcp-l4/helm-install/#%E4%BA%8C-%E5%AE%89%E8%A3%85helm%E5%AE%A2%E6%88%B7%E7%AB%AF)了解Helm客户端安装。

注意这里helm_version报错就直接helm_version=v2.14.3

```bash
$ helm_version=`helm version |grep Client | awk -F""\" '{print $2}'`    
$ helm init   --skip-refresh \
    --service-account tiller \
    --tiller-image 10.164.204.195:18080/rancher/tiller:${helm_version}   
$ kubectl get all -n kube-system
```

## 离线安装Rancher

### 打包Rancher Charts模板

```
# 添加`Rancher Charts`仓库
$ helm repo add rancher-stable https://releases.rancher.com/server-charts/stable    
# 指定安装的版本
$ helm fetch rancher-stable/rancher --version v2.3.2
$ tar zxvf rancher-2.3.2.tgz
```



### 使用`自己的自签名证书`

```bash
$ kubectl create namespace cattle-system
$ kubectl   \
    -n cattle-system create \
    secret tls tls-rancher-ingress \
    --cert=./ssl/tls.crt \
    --key=./ssl/tls.key
$ kubectl   \
    -n cattle-system \
    create secret generic tls-ca \
    --from-file=./ssl/cacerts.pem
```

执行以下命令进行rancher安装

```bash
$ helm   install ./rancher \
    --name rancher \
    --namespace cattle-system \
    --set hostname=www.rancher.haiercloud.com \
    --set ingress.tls.source=secret \
    --set privateCA=true       
```

到这里要等3分钟左右，服务部署完成后，给服务patch hosts，cattle 的服务是登陆rancher 后才会创建哦

### 为Cluster Pod添加主机别名hosts解析

```
$ kubectl  -n cattle-system \
    patch deployments rancher --patch '{
        "spec": {
            "template": {
                "spec": {
                    "hostAliases": [
                        {
                            "hostnames":
                            [
                                "www.rancher.haiercloud.com"
                            ],
                                "ip": "10.164.194.120"
                        }
                    ]
                }
            }
        }
    }'     
    
$ kubectl  -n cattle-system \
patch deployments cattle-cluster-agent --patch '{
    "spec": {
        "template": {
            "spec": {
                "hostAliases": [
                    {
                        "hostnames":
                        [
                            "www.rancher.haiercloud.com"
                        ],
                            "ip": "10.164.194.120"
                    }
                ]
            }
        }
    }
}'   


$ kubectl  -n cattle-system \
patch daemonsets cattle-node-agent --patch '{
    "spec": {
        "template": {
            "spec": {
                "hostAliases": [
                    {
                        "hostnames":
                        [
                            "www.rancher.haiercloud.com"
                        ],
                            "ip": "10.164.194.120"
                    }
                ]
            }
        }
    }
}'
```



注：以上命令需要顺序依次执行。

参考链接：

rancher官网： <https://www.rancher.cn/docs/rancher/v2.x/cn/installation/air-gap-installation/ha/>

Rancher2.1从搭建集群到pipeline部署项目：<https://juejin.im/post/5c4c12e5f265da615e05ce4c>