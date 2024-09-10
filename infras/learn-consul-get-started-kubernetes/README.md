# Getting Started with Consul on Kubernetes

Install Consul on Kubernetes and quickly explore service mesh features such as service-to-service permissions with intentions, ingress with API Gateway, and enhanced observability.

## Tutorial Collection URL

[https://developer.hashicorp.com/consul/tutorials/get-started-kubernetes](https://developer.hashicorp.com/consul/tutorials/get-started-kubernetes)


### cmd

```python

helm repo add hashicorp https://helm.releases.hashicorp.com
helm install --values helm/values-v1.yaml consul hashicorp/consul --create-namespace --namespace consul --version "1.2.0"

kubectl get --namespace consul secrets/consul-bootstrap-acl-token --template={{.data.token}} | base64 -d
```
