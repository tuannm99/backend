global:
  enabled: false
  name: consul
  datacenter: ${datacenter}
  image: "hashicorp/consul-enterprise:${consul_version}-ent"
  acls:
    manageSystemACLs: true
    bootstrapToken:
      secretName: ${cluster_id}-hcp
      secretKey: bootstrapToken
  tls:
    enabled: true
    enableAutoEncrypt: true
    caCert:
      secretName: ${cluster_id}-hcp
      secretKey: caCert
  metrics:
    enabled: true
    enableAgentMetrics: true
    agentMetricsRetentionTime: "1m"

externalServers:
  enabled: true
  hosts: ${consul_hosts}
  httpsPort: 443
  useSystemRoots: true
  k8sAuthMethodHost: ${k8s_api_endpoint}

server:
  enabled: false

connectInject:
  transparentProxy:
    defaultEnabled: true
  enabled: true
  default: true
  metrics:
    defaultEnabled: true
%{ if !consul_client_agent ~}
  consulNode:
    meta:
      terraform-module: "hcp-aks-client"
%{ endif ~}

  apiGateway:
    managedGatewayClass:
      serviceType: LoadBalancer