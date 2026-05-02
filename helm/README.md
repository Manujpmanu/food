# Helm (lightweight)

This chart deploys the frontend app with minimal resources.

Chart path:
- `helm/food-app`

Quick use:

```bash
helm lint helm/food-app
helm template food-app helm/food-app

helm upgrade --install food-app helm/food-app \
  --namespace default \
  --create-namespace

kubectl get deploy,svc,pods -l app.kubernetes.io/instance=food-app
kubectl port-forward svc/food-app-food-app 5173:80
```

Set a custom image:

```bash
helm upgrade --install food-app helm/food-app \
  --set image.repository=ghcr.io/keerthinarayan/food-app \
  --set image.tag=latest
```
