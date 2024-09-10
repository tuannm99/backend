# Kubernetes Manifests for Jenkins Deployment

Refer https://devopscube.com/setup-jenkins-on-kubernetes-cluster/ for step by step process to use these manifests.

# create secret
openssl req -x509 -nodes -days 99999 -newkey rsa:2048 -keyout jenkins-tls.key -out jenkins-tls.crt -subj "/CN=jenkins.tuan-nm.com/O=jenkins" 
kubectl create secret tls jenkins-tls --cert=jenkins-tls.crt --key=jenkins-tls.key -n jenkins
