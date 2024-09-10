-- first init
curl -sfL https://get.k3s.io | K3S_TOKEN=k3s-token sh -s - server --cluster-init --disable traefik
-- join etcd
curl -sfL https://get.k3s.io | K3S_TOKEN=k3s-token sh -s - server --disable traefik --server https://vmi2097890.contaboserver.net:6443
-- join agent (worker)
curl -sfL https://get.k3s.io | K3S_TOKEN=k3s-token sh -s - agent --server https://vmi2097890.contaboserver.net:6443
