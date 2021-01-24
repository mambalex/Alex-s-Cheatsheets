---
title: Kubernetes
slug: "/kubernetes"
order: 4
description: K8s cheat sheet
---

## CLI

```bash
# Get
kubectl get po
kubectl get svc
kubectl get all -A           # --all-namespaces
kubectl get nodes -o wide
kubectl get po --selector app=App1
kubectl label nodes node-1 size=large

kubectl top pod POD
kubectl top node

kubectl logs POD
kubectl logs POD -c CONTAINER

kubectl exec POD -- ls /var/log

kubectl edit deployment nginx
kubectl scale deployment nginx --replicas=5
kubectl set image deployment nginx nginx=nginx:1.18

kubectl apply -f myManifest.yml
kubectl delete -f myManifest.yml
```

## Pods & Deployments

{col-2/2}

```bash
kubectl run nginx \
		--image=nginx \
	    --port=8080 \
		--lables='app=web,env=prod' \
		--env="DNS=cluster" \
		--dry-run=client \
		-o yaml > nginx.yaml
```

```bash
kubectl create deployment my-dp \
		--image=nginx \
		--replicas=3  \
		--port=5701  \
		--dry-run=client \
		-o yaml > nginx.yaml
```

See: [kubectl reference](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-deployment-em-)

<br>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
    - name: myapp-container
      image: busybox:1.28
      command: ["sh", "-c", "echo The app is running! && sleep 3600"]
  initContainers:
    - name: init-mydb
      image: busybox:1.28
      command: ["/bin/sh", "-c"]
      args:
        - until nslookup mydb.default.svc.cluster.local;
        - do echo waiting for mydb; sleep 2; done
```

<br>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx # matches pod's labels
  template: # pod
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

## Services

{col-2/2}

```bash
kubectl create service clusterip my-cs \
		--tcp=5678:8080 \     # port:targetPort
		--dry-run=client \
		-o yaml > nginx.yaml
```

```bash
kubect expose pod redis \
		--name=redis-svc \
		--port=8080 \
		--target-port=6379
```

<br>

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp # pod's label
  ports:
    - protocol: TCP
      port: 80 # service's port
      targetPort: 9376 # pod's port. same as port by default
```

## Persistent Volume

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
spec:
  capacity:
    storage: 40Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /var/data
```

## Persistent Volume Claim

{col-2/2}

```yaml
# One to one relationship between PVs and PVCs

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  resources:
    requests:
      storage: 8Gi
  accessModes:
    - ReadWriteOnce
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: alpine
      image: alpine
      volumeMounts:
        - mountPath: /opt
          name: data-volume
  volumes:
    - name: data-volume
      persistentVolumeClaim:
        claimName: myclaim
```

## Storage Class

{col-2/2}

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: aws-storage
provisioner: kubernetes.io/aws-ebs
# Dynamic provisioning
```

See: [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  storageClassName: aws-storage
  resources:
    requests:
      storage: 8Gi
  accessModes:
    - ReadWriteOnce
```

## Static pods

```bash
# Static Pods are always bound to one Kubelet on a specific node.
# the nodeName is appended to the podName
# staticPodPath: <the directory> in kubelet config file
# Create a YAML file and store it in the staticPodPath
```

## Ingress

```yaml
# Need to install ingress controller, or it won't work
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: / # trim the url path for the backend
spec:
  rules:
    - http:
        paths:
          - path: /testpath
            pathType: Prefix
            backend:
              service:
                name: test
                port:
                  number: 80
```

## Network policy

```yaml
# The selected pod will reject any connections
# except the connections allowed by the network policy
# Not all CNI plugins support Network policy (Falnnel doesn't support)

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              project: myproject
        - podSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 6379
```

## Node Affinity & Selector

```yaml
apiVersion: v1
kind: Pod     # at pod level
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
	nodeSelector:
      size: large # node's label
```

<br>

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
	affinity:
	  nodeAffinity:
      requiredDuringSchedulingIgnoreDuringExecution:
		  nodeSelectorTerms:
		  - matchExpressions:
			- key: size
			  operator: Exists
```

## Taints & Tolerations

```bash
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoSchedule- # untaint
```

## Drain

```bash
# move pods to other nodes
kubectl drain node-1 --ignore-daemonsets
# make the node unschedulable, doesn't remove pods
kubectl cordon node-2
# back in service, pods would not be moved back
kubectl uncordon node-1
```

## Etcd

```bash
etcdctl snapshot save --help

# Backup
ETCDCTL_API=3 etcdctl \
  --endpoints=x.x.x.x:2379 \
  --cert="" \      # etcd cert.pub
  --key="" \       # etcd private.key
  --cacert="" \    # certificate authority cert.pub
  snapshot save /data/backup/etcd-snapshot.db

# Restore
ETCDCTL_API=3 etcdctl \
  --endpoints=x.x.x.x:2379 \
  --cert="" \
  --key="" \
  --cacert="" \
  --data-dir="/var/lib/etcd-from-backup" \
  --initial-cluster="default=https://xx.xx.xx:2380" \
  --initial-advertise-peer-urls="https://xx.xx.xx:2380" \
  --initial-cluster-token="etcd-cluster-1"  \
  --name="default"   \
  snapshot restore /data/backup/etcd-snapshot.db

# <modify etcd.yaml(static pod) on the master-node>
# --initial-cluster-token"etcd-cluster-1"
# mountPath: /var/lib/etcd-from-backup
```
