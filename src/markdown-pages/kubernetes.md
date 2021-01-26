---
title: Kubernetes
slug: "/kubernetes"
order: 2
description: K8s cheat sheet
---

## CLI

```bash
kubectl get po
kubectl get svc
kubectl get all -A           # --all-namespaces
kubectl get nodes -o wide
kubectl get po --selector app=App1
kubectl label nodes node-1 size=large

kubectl top pod POD
kubectl top node

kubectl logs POD
kubectl logs -f POD  # follow the logs
kubectl logs POD -c CONTAINER

kubectl exec -it POD -- /bin/sh

kubectl edit deployment nginx
kubectl scale deployment nginx --replicas=5
kubectl set image deployment nginx nginx=nginx:1.18

kubectl apply -f myManifest.yml
kubectl delete -f myManifest.yml

journalctl -u kubelet
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
      resources:
        requests:
          memory: 64Mi
          cpu: 250m
        limits:
          memory: 128Mi
          cpu: 500m
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

## ConfigMap

{col-2/2}

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myConfigMap
data:
  APP_COLOR: blue
  APP_MODE: prod
```

```bash
kubectl create configmap \
        <config-name>    \
        --from-literal=<key>=<value>
```

<br>

{col-2/2}

```yaml
apiVersion: v1
kind: Pod
metadata:
name: simple-webapp-color
spec:
  containers:
    - name: simple-webapp-color
      image: alpine
      ## All ENV from the ConfigMap
      ## highlight-range{1-3}
      valueFrom:
        - configMapKeyRef:
          name: myConfigMap
```

```yaml
containers:
  - name: simple-webapp-color
    image: alpine
    env:
      - name: APP_NAME
          value: myApp
      ## Single ENV
      - name: MY_COLOR
        ## highlight-range{1-4}
        valueFrom:
          configMapKeyRef:
            name: myConfigMap
            key: APP_COLOR
```

<br>

{col-1/2}

```yaml
## Mount ConfigMap data as volume
containers:
  - name: simple-webapp-color
    image: alpine
    volumeMounts:
      - name: config-volume
        mountPath: /etc/conifg
## highlight-range{1-4}
volumes:
  - name: config-volume
    configMao:
      name: myConfigMap
# cat /etc/config/APP_COLOR
# blue
```

## Secret

{col-2/2}

```yaml
apiVersion: v1
kind: Secret
type: Opaque # default type
data:
  username: YWRtaW4= # base64 encoded
  password: MWYyZDFlMmU2N2Rm
```

```bash
kubectl create secret generic \
  <secret-name> \
  --from-literal=DB_Host=sql01 \
  --from-literal=DB_User=root  \
  --from-literal=DB_Password=password123 \
```

```yaml
## All ENV
envFrom:
  - secretRef:
    name: my-secret
## Single ENV
env:
  - name: DB_Password
    valueFrom:
      secretKeyRef:
        name: my-secret
        key: DB_Pasword
## Volume
volumes:
  - name: app-secret-volume
    secret:
      secretName: app-secret
```

## Volume

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
    - image: alpine
      name: alpine
      volumeMounts:
        - mountPath: /opt # inside the container
          name: data-volume
  volumes:
    - name: data-volume
      hostPath:
        path: /data # host path
        type: Directory
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

## Role & RoleBinding

{col-2/2}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
  namespace: dev
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["list“, "get"]
```

```yaml

apiVersion: rbac.authorization.k8s.io/v1
 ## highlight-range{1}
kind: ClusterRole
metadata:
  name: cluster-administrator
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["list“, "get"]
```

{col-2/2}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: devuser-developer-binding
  namespace: dev
subjects:
  - kind: User # Bind to an User
    name: dev-user # Name is case sensitive
    apiGroup: rbac.authorization.k8s.io
  - kind: ServiceAccount # Bind to a SA
    name: mySA
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
```

```yaml
# Bind a role to all the namespaces
apiVersion:
  rbac.authorization.k8s.io/v1
  ## highlight-range{1}
kind: ClusterRoleBinding
metadata:
  name: cluster-admin-role-binding
subjects:
  - kind: User
    name: cluster-admin

roleRef:
  kind: ClusterRole
  name: cluster-administratorr
  apiGroup: rbac.authorization.k8s.io
```

## ServiceAccount

```yaml
# Each namespace has a default ServiceAccount, named default
# The default ServiceAccount of the Pod’s namespace is used if no SA is specified
apiVersion: v1
kind: ServiceAccount
metadata:
  name: dev-sa
  namespace: dev
```

See: [ServiceAccount tips](https://medium.com/better-programming/k8s-tips-using-a-serviceaccount-801c433d0023)

## RBAC

```bash
Kubernetes does not manage user accounts natively
# kubectl create user user1            ❌
# kubectl create serviceaccount mysv   ✅

Available auth mechanisms:
  1. Static password file
  2. Static token file
  ## highlight-range{1}
  3. Certificates
  4. Identity Services

Certificate workflow:
  1. Generate an user private key
  2. Generate a certificate signing request
  3. Create a certificate signing request objecti
  4. Approve the singinig request using Certificate API
# Note: Controller-manager handles all the certificate related operations
```

<br>

```bash
# Step 1. Generate an user private key
openssl genrsa -out alex.key 2048
# Step 2. Generate a certificate signing request
opensslreq -new -key alex.key -subj "/CN=alex" -out alex.csr
# Step 4. Approve the singinig request using Certificate API
kubectl get csr
kubectl certificate approve alex
```

```yaml
# Step 3. Create a certificate signing request object
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
metadata:
	name: alex
spec:
	groups:
		- system: authenticated
	usages:
		- digital signature-key encipherment-server auth
	request:
     LSOTLSFDXXX... # `cat alex.csr | base64`
# kubectl apply -f csr.yaml
```

## Image security

{col-2/2}

```bash
# Built-in secret type
kubectl create secret docker-registry regcred \
  -- docker-server=xx    \
  -- docker-username=xx  \
  -- docker-password=xx  \
  -- docker-email=xx
```

See: [secret docker-registry](https://medium.com/better-programming/k8s-tips-using-a-serviceaccount-801c433d0023)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
spec:
  containers:
    - name: myapp-container
      image: private-reg.io/myapp
  ## highlight-range{1-2}
  imagePullSecrets:
    - name: regcred
```

## K8s networking

```bash
CNI plugin
# Every Pod should get its own IP address
# Every Pod should be able to communicate with other pods without NAT
# CNI plugin options: flannel, Weave Net, Calico, Cilium, etc.

CoreDNS
# CoreDNS is installed by default in Kubernetes since v1.9 (used to be kube-dns)
# Fully qualified domain name
# Service: service-name.[namespace].svc.cluster.local
# Pod:     10-244-2-5.[namespace].pod.cluster.local


kube-proxy
# kube-proxy is a network proxy that runs on each node in the cluster
# kube-proxy manages `Service to pods` traffic forwarding
# L4 Round Robin Load Balancing

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

## QoS

```yaml
# Pod eviction occurs in the following order:
1. BestEffort
2. Burstable
3. Guaranteed

#  Every Container in the Pod must have a memory/cpu limit
#  and a memory/cpu request and they must be the same
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    ...
status:
  ## highlight-range{1}
  qosClass: Guaranteed

#  The Pod does not meet the criteria for QoS class Guaranteed
#  At least one Container in the Pod has a memory or CPU request
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  ## highlight-range{1}
  qosClass: Burstable

# The Containers in the Pod must not have any memory or CPU limits or requests
spec:
  containers:
    ...
    resources: {}
  ...
status:
  ## highlight-range{1}
  qosClass: BestEffort
```

## Node Affinity & Selector

```yaml
apiVersion: v1
kind: Pod # at pod level
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

## Static pods

```bash
# Static Pods are always bound to one Kubelet on a specific node.
# he nodeName is appended to the podName
# staticPodPath: <the directory> in kubelet config file
# Create a YAML file and store it in the staticPodPath
```

## K8s Architecture

```bash
Master node
  - Kube-apiserver
    # Exposes the kubernetes API
    # Handling internal and external requests
    # Authenticate user & validate request
  - Etcd
    # Distributed key-value store for all cluster data
    # Run etcd as a cluster of odd members
    # Minimum 3 etcds for HA
  - Kube-scheduler
    # Find the best node for the newly creted pod
    # 1. Filter Nodes  2. Rank Nodes
  - Kube-controller-manager
    # Watch status (e.g. default node monitor period = 5s)
    # Remediate situation

Worker node
  - Kubelet
    # An agent that runs on each node in the cluster
    # Register & monitor Node
    # Create & monitor PODs
  - Kube-proxy
    # kube-proxy manages `Service to pods` traffic forwarding
    # L4 Round Robin Load Balancing
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
