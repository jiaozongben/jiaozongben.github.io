---
layout: post
title:  容器化(04):分布式存储Ceph部署
no-post-nav: true
category: docker
tags: [kubernetes,k8s,rancher,ceph]
excerpt: k8s
---

# Ceph快速部署



```
ceph-deploy purge docker01 docker02 docker03 docker04
ceph-deploy purgedata docker01 docker02 docker03 docker04
ceph-deploy forgetkeys



sudo yum -y install epel-release
sudo yum -y install ceph ceph-radosgw ceph-deploy
rm -rf /data/*
ceph-deploy new docker01 

ceph-deploy mon create-initial

 

ssh docker01
sudo mkdir /data/osd1
sudo chown -R ceph:ceph /data/osd1
exit

ssh docker02
sudo mkdir /data/osd2
sudo chown -R ceph:ceph /data/osd2
exit


ssh docker03
sudo mkdir /data/osd3
sudo chown -R ceph:ceph /data/osd3
exit


ssh docker04
sudo mkdir /data/osd4
sudo chown -R ceph:ceph /data/osd4
exit


ceph-deploy osd prepare docker02:/data/osd2 docker03:/data/osd3 docker04:/data/osd4
ceph-deploy osd activate docker02:/data/osd2 docker03:/data/osd3 docker04:/data/osd4
ceph-deploy admin docker01 docker02 docker03 docker04 


---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: ceph-rbd
provisioner: ceph.com/rbd
parameters:
  monitors: 10.164.204.47:6789
  pool: kube
  adminId: admin
  adminSecretName: ceph-admin-secret
  adminSecretNamespace: kube-system
  userId: kube
  userSecretName: ceph-secret
  userSecretNamespace: kube-system
  fsType: xfs
  imageFormat: "2"
  imageFeatures: "layering"


https://github.com/kubernetes-incubator/external-storage/blob/master/ceph/rbd/README.md

kubectl create ns ceph-cluster
cd $GOPATH/src/github.com/kubernetes-incubator/external-storage/ceph/rbd/deploy
NAMESPACE=ceph-cluster # change this if you want to deploy it in another namespace
sed -r -i "s/namespace: [^ ]+/namespace: $NAMESPACE/g" ./rbac/clusterrolebinding.yaml ./rbac/rolebinding.yaml
kubectl -n $NAMESPACE apply -f ./rbac

deploy 
examples
ceph osd pool create kube 128
ceph auth add client.kube mon 'allow r' osd 'allow rwx pool=kube'

kubectl create -f examples/secret.yaml

kubectl create -f examples/class.yaml


kubectl patch storageclass rbd -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'  


```

