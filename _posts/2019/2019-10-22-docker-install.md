---
layout: post
title:  CentOS7上安装docker
no-post-nav: true
category: docker
tags: [Docker]
excerpt: Docker
---

# CentOS7上安装docker



## 前提条件

> Docker 运行在 CentOS 7 上，要求系统为64位、系统内核版本为 3.10 以上。

## 修改系统源

```
yum install ca-certificates ;
update-ca-trust;

cp /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo-bak
cat << 'EOF' > /etc/yum.repos.d/CentOS-Base.repo
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#

[base]
name=CentOS-$releasever - Base - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/os/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/os/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7

#released updates
[updates]
name=CentOS-$releasever - Updates - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/updates/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/updates/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7

#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/extras/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/extras/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7

#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/centosplus/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/centosplus/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7

#contrib - packages by Centos Users
[contrib]
name=CentOS-$releasever - Contrib - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/contrib/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/contrib/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/contrib/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7

EOF
```



## docker-ce安装

```
# 定义用户名
NEW_USER=docker
# 添加用户(可选)
sudo adduser $NEW_USER
# 为新用户设置密码
sudo passwd $NEW_USER
# 为新用户添加sudo权限
sudo echo "$NEW_USER ALL=(ALL) ALL" >> /etc/sudoers
# 卸载旧版本Docker软件
sudo yum remove docker \
              docker-client \
              docker-client-latest \
              docker-common \
              docker-latest \
              docker-latest-logrotate \
              docker-logrotate \
              docker-selinux \
              docker-engine-selinux \
              docker-engine \
              container*
# 定义安装版本
export docker_version=18.06.3
# step 1: 安装必要的一些系统工具
sudo yum update -y;
sudo yum install -y yum-utils device-mapper-persistent-data \
    lvm2 bash-completion;
# Step 2: 添加软件源信息
sudo yum-config-manager --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo;
# Step 3: 更新并安装 Docker-CE
sudo yum makecache all;
version=$(yum list docker-ce.x86_64 --showduplicates | sort -r|grep ${docker_version}|awk '{print $2}';
sudo yum -y install --setopt=obsoletes=0 docker-ce-${version} docker-ce-selinux-${version};
# 如果已经安装高版本Docker,可进行降级安装(可选)
yum downgrade --setopt=obsoletes=0 -y docker-ce-${version} docker-ce-selinux-${version};
# 把当前用户加入docker组
sudo usermod -aG docker $NEW_USER;
# 设置开机启动
sudo systemctl enable docker;
```

## 最佳实践

对于通过systemd来管理服务的系统(比如CentOS7.X、Ubuntu16.X), Docker有两处可以配置参数: 一个是`docker.service`服务配置文件,一个是Docker daemon配置文件daemon.json。

1. `docker.service`

   对于CentOS系统，`docker.service`默认位于`/usr/lib/systemd/system/docker.service`；对于Ubuntu系统，`docker.service`默认位于`/lib/systemd/system/docker.service`

2. `daemon.json`

   daemon.json默认位于`/etc/docker/daemon.json`，如果没有可手动创建，基于systemd管理的系统都是相同的路径。通过修改`daemon.json`来改过Docker配置，也是Docker官方推荐的方法。

以下说明均基于systemd,并通过`/etc/docker/daemon.json`来修改配置。

### daemon.json

/etc/docker/daemon.json

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

参数解释：

- 支持自定义下载和上传镜像的并发数，"max-concurrent-downloads": 3,"max-concurrent-uploads": 5
- 配置镜像加速地址 "registry-mirrors"
- 配置日志驱动 ：log-opts 100mb，容器在运行时会产生大量日志文件，很容易占满磁盘空间。

### Kernel性能调优

```
cat >> /etc/sysctl.conf<<EOF
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-iptables=1
net.ipv4.neigh.default.gc_thresh1=4096
net.ipv4.neigh.default.gc_thresh2=6144
net.ipv4.neigh.default.gc_thresh3=8192
EOF
```

数值根据实际环境自行配置，最后执行`sysctl -p`保存配置。

### hosts

配置每台主机的hosts(/etc/hosts),添加`host_ip $hostname`到`/etc/hosts`文件中。

### 关闭防火墙

```
systemctl stop firewalld.service && systemctl disable firewalld.service
```

### 配置主机时间、时区、系统语言

1.查看时区

```
date -R
```

2.修改时区

```
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

3.修改系统语言环境

```
sudo echo 'LANG="en_US.UTF-8"' >> /etc/profile;source /etc/profile
```
