# cert-manager
```python
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/<VERSION>/cert-manager.crds.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.3/cert-manager.yaml
```

# longhorn storageclass
```python
each node need-> apt-get install dmsetup cryptsetup nfs-common open-iscsi -y
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.7.0/deploy/longhorn.yaml
```

# ingress

```python
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

# mongodb

```python
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install dev bitnami/mongodb -n default
helm delete dev -n default
```

# rancher

```python
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest

kubectl create namespace cattle-system

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/<VERSION>/cert-manager.crds.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.3/cert-manager.yaml

helm repo add jetstack https://charts.jetstack.io

helm repo update

# helm install cert-manager jetstack/cert-manager \
#   --namespace cert-manager \
#   --create-namespace

------------
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.domain.com \
  --set replicas=1 \
  --set bootstrapPassword=pwd \
  --set ingress.tls.source=letsEncrypt \
  --set letsEncrypt.email=mail \
  --set letsEncrypt.ingress.class=nginx


kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}{{"\n"}}'

```

# kafka using confluent

```python
kubectl create namespace confluent
kubectl config set-context --current --namespace confluent

helm repo add confluentinc https://packages.confluent.io/helm
helm repo update
helm upgrade --install confluent-operator confluentinc/confluent-for-kubernetes


export TUTORIAL_HOME="https://raw.githubusercontent.com/confluentinc/confluent-kubernetes-examples/master/quickstart-deploy"
kubectl apply -f $TUTORIAL_HOME/confluent-platform.yaml
kubectl apply -f $TUTORIAL_HOME/producer-app-data.yaml

kubectl port-forward controlcenter-0 9021:9021

kubectl delete -f $TUTORIAL_HOME/producer-app-data.yaml
kubectl delete -f $TUTORIAL_HOME/confluent-platform.yaml
kubectl delete namespace confluent

```

# postgres

```python
https://postgres-operator.readthedocs.io/en/latest/quickstart/
```
