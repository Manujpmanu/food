# Kubernetes deployment (lightweight)

This folder contains minimal Kubernetes manifests to run the frontend in a local cluster (minikube, kind, or k3d).

Principles:
- Single replica, small resource requests/limits to stay lightweight
- Uses an image published to GitHub Container Registry; you can replace it with your own
- Uses `kustomize` so deployment is `kubectl apply -k k8s`

Quick commands (minikube):

```bash
# Start minikube with small footprint
minikube start --memory=2048 --cpus=2

# Build locally and load into minikube (optional)
docker build -t food-app:latest .
minikube image load food-app:latest

# Apply manifests
kubectl apply -k k8s

# Forward port for local access
kubectl port-forward svc/food-app 5173:80

# Test
curl http://localhost:5173
```

Quick commands (kind):

```bash
# Create a small kind cluster if not present
kind create cluster --name food-cluster --config=- <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 5173
        hostPort: 5173
        protocol: TCP
EOF

# Build and load image
docker build -t food-app:latest .
kind load docker-image food-app:latest --name food-cluster

# Deploy
kubectl apply -k k8s

# Test via host port (if using port mapping) or port-forward
curl http://localhost:5173
```

Notes:
- If you prefer to use the image from the registry, update `k8s/deployment.yaml` image field to your registry image (e.g. `ghcr.io/keerthinarayan/food-app:latest`).
- For production clusters, add resource requests, liveness/readiness tuning, and an Ingress with TLS.
