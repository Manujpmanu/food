# DevOps, CI/CD, Docker, Kubernetes, Helm & Jenkins Implementation Report

Date: 2026-05-02

Authors: Keerthi Narayan and Monish

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Scope and Context](#2-project-scope-and-context)
3. [Current Implementation Status](#3-current-implementation-status)
4. [Docker Implementation (Detailed)](#4-docker-implementation-detailed)
5. [Kubernetes Implementation (Detailed)](#5-kubernetes-implementation-detailed)
6. [Helm Implementation (Detailed)](#6-helm-implementation-detailed)
7. [Jenkins Pipeline Implementation (Detailed)](#7-jenkins-pipeline-implementation-detailed)
8. [GitHub Actions CI/CD Status](#8-github-actions-cicd-status)
9. [End-to-End Deployment Flows](#9-end-to-end-deployment-flows)
10. [Validation and Verification Results](#10-validation-and-verification-results)
11. [Operational Guidance](#11-operational-guidance)
12. [Risks, Constraints, and Assumptions](#12-risks-constraints-and-assumptions)
13. [Recommendations and Next Improvements](#13-recommendations-and-next-improvements)
14. [Appendix: Commands Reference](#14-appendix-commands-reference)

---

## 1. Executive Summary

This repository now contains an integrated DevOps setup for a frontend-only React + Vite application with the following delivery options:

- Docker-based deployment for lightweight single-host runtime.
- Kubernetes deployment using raw manifests (`kustomize`) for minimal overhead.
- Kubernetes deployment using Helm chart for parameterized releases.
- Jenkins pipeline with selectable deployment target (`docker` or `kubernetes`) and Kubernetes method (`kustomize` or `helm`).
- GitHub Actions pipelines already active and passing in the remote repository.

The implementation is intentionally optimized for simplicity and lower resource consumption while preserving CI/CD automation and deployment flexibility.

---

## 2. Project Scope and Context

### 2.1 Application type

- Frontend-only SPA (React + Vite).
- No backend service in this repository.

### 2.2 DevOps scope covered

- Build and package app artifact.
- Containerize app image.
- Run locally with Docker Compose.
- Deploy to Kubernetes via either:
  - raw manifests (`kubectl apply -k`), or
  - Helm chart (`helm upgrade --install`).
- Orchestrate CI/CD lifecycle via Jenkins and GitHub Actions.

### 2.3 Primary infrastructure files

- `Dockerfile`
- `docker-compose.yml`
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/kustomization.yaml`
- `helm/food-app/Chart.yaml`
- `helm/food-app/values.yaml`
- `helm/food-app/templates/deployment.yaml`
- `helm/food-app/templates/service.yaml`
- `Jenkinsfile`
- `.github/workflows/*.yml`

---

## 3. Current Implementation Status

### 3.1 Completed

1. Docker multi-stage image build.
2. Lightweight Docker Compose runtime with a robust Node-based health check.
3. Kubernetes manifests with resource limits/requests and readiness/liveness probes.
4. Helm chart (v2) with configurable image, service, probes, and resources.
5. Jenkins deploy target selection:
   - `DEPLOY_TARGET=docker`
   - `DEPLOY_TARGET=kubernetes`
6. Jenkins Kubernetes deploy method selection:
   - `K8S_DEPLOY_METHOD=kustomize`
   - `K8S_DEPLOY_METHOD=helm`

### 3.2 Already existing and intentionally preserved

- GitHub Actions workflows were not changed in this pass because they are already running and passing.

---

## 4. Docker Implementation (Detailed)

### 4.1 Build strategy

The `Dockerfile` uses a multi-stage build:

1. **Builder stage** (`node:18-alpine`)
   - Installs dependencies with `npm ci --legacy-peer-deps`.
   - Builds production assets using `npm run build`.
2. **Runtime stage** (`node:18-alpine`)
   - Installs `serve` globally.
   - Copies only built `dist` artifacts.
   - Exposes port `5173`.

This approach reduces runtime image footprint compared to a single-stage build that keeps dev dependencies.

### 4.2 Runtime health checks

- Docker image includes `HEALTHCHECK` in `Dockerfile`.
- Compose service health check in `docker-compose.yml` uses a Node one-liner HTTP probe.

Reason for Node-based check:
- avoids dependency on `curl` binary inside container,
- improves portability and reliability across minimal images.

### 4.3 Compose design

`docker-compose.yml` includes only one service (`food-app`) because this is a frontend-only repository. This keeps runtime simple and low-resource.

### 4.4 Docker operational behavior

- Restart policy: `unless-stopped`.
- Exposed port: `5173:5173`.
- Service labels for identification.
- Health gate intervals and retries configured for basic runtime resilience.

---

## 5. Kubernetes Implementation (Detailed)

### 5.1 Manifests location

- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/kustomization.yaml`

### 5.2 Deployment design

`k8s/deployment.yaml` provides:

- single replica (`replicas: 1`) for lightweight operation,
- container image default: `ghcr.io/keerthinarayan/food-app:latest`,
- resource requests and limits:
  - requests: `100m CPU`, `64Mi memory`,
  - limits: `250m CPU`, `128Mi memory`,
- readiness and liveness probes on `/` at container port `5173`.

### 5.3 Service design

`k8s/service.yaml` exposes app internally as `ClusterIP`:

- service port: `80`,
- target port: `5173`.

Access pattern is via port-forward (or Ingress when added later).

### 5.4 Kustomize behavior

`k8s/kustomization.yaml` references deployment and service for consistent apply/delete operations:

- apply: `kubectl apply -k k8s`
- delete: `kubectl delete -k k8s`

---

## 6. Helm Implementation (Detailed)

### 6.1 Chart structure

Helm chart path: `helm/food-app`

Key files:

- `Chart.yaml` (chart metadata)
- `values.yaml` (defaults)
- `templates/deployment.yaml`
- `templates/service.yaml`
- `templates/_helpers.tpl`
- `templates/NOTES.txt`

### 6.2 Default values

`values.yaml` includes lightweight defaults:

- `replicaCount: 1`
- image repository/tag/pull policy
- service type and ports
- resources (requests/limits)
- probe timings and paths

### 6.3 Templating behavior

- Deployment and Service names are generated through helper templates.
- Labels follow Helm conventions (`app.kubernetes.io/*`) for observability and release tracking.
- Probes and resources are driven by `values.yaml` and can be overridden per environment.

### 6.4 Helm deployment pattern

The chart supports release-driven deployment:

```bash
helm upgrade --install food-app helm/food-app \
  --namespace default \
  --create-namespace
```

Image overrides are supported at deploy time:

```bash
helm upgrade --install food-app helm/food-app \
  --set image.repository=ghcr.io/keerthinarayan/food-app \
  --set image.tag=latest
```

---

## 7. Jenkins Pipeline Implementation (Detailed)

### 7.1 Jenkins role in this repository

Jenkins acts as a full orchestration layer for:

- source checkout,
- dependency install,
- lint/test/build,
- Sonar scanning,
- Docker image build/push,
- deploy to Docker or Kubernetes,
- health checks.

### 7.2 Parameterized deployment model

`Jenkinsfile` now supports configurable deployment behavior through parameters:

1. `DEPLOY_TARGET`
   - `docker` or `kubernetes`
2. `K8S_DEPLOY_METHOD`
   - `kustomize` or `helm`
3. `K8S_NAMESPACE`
4. `HELM_RELEASE`
5. `HELM_CHART_PATH`

This enables one pipeline to support multiple deployment strategies without duplicate job definitions.

### 7.3 Stage-by-stage behavior

Pipeline stages:

1. Checkout
2. Install Dependencies
3. Code Quality Analysis
4. Unit Tests
5. Build
6. SonarQube Analysis
7. Docker Build
8. Docker Push (only `main`)
9. Deploy (only `main`)
10. Health Check

### 7.4 Deploy stage logic

- If `DEPLOY_TARGET=docker`:
  - runs `docker compose down`, `docker compose up -d`, `docker compose ps`.
- If `DEPLOY_TARGET=kubernetes` and `K8S_DEPLOY_METHOD=kustomize`:
  - `kubectl apply -k k8s`,
  - updates image via `kubectl set image`.
- If `DEPLOY_TARGET=kubernetes` and `K8S_DEPLOY_METHOD=helm`:
  - validates Helm is installed on agent,
  - runs `helm upgrade --install` with image overrides,
  - forces deterministic deployment name with `fullnameOverride=food-app`.

### 7.5 Health verification in Jenkins

- Docker target: HTTP check on `http://localhost:5173`.
- Kubernetes target: rollout status check for `deployment/food-app` in selected namespace.

### 7.6 Why this Jenkins design is useful

- keeps one pipeline for all deployment modes,
- provides switchable but controlled release behavior,
- remains compatible with low-resource lab/mini-project setups,
- is easy to demonstrate in academic/project reporting.

---

## 8. GitHub Actions CI/CD Status

GitHub Actions workflows are already active and passing in repository history. They were intentionally not modified in this phase to avoid destabilizing a working CI/CD flow.

Active workflow categories:

- CI/CD pipeline,
- security scanning,
- Docker build/deploy workflow.

---

## 9. End-to-End Deployment Flows

### 9.1 Flow A: Local Docker runtime

1. Build image.
2. Start compose service.
3. Verify health and access on port `5173`.

### 9.2 Flow B: Kubernetes via kustomize

1. Build/push image.
2. Apply manifests with `kubectl apply -k k8s`.
3. Update deployment image if needed.
4. Wait for rollout.

### 9.3 Flow C: Kubernetes via Helm

1. Build/push image.
2. Run `helm upgrade --install` with image repo/tag overrides.
3. Wait for rollout and verify service/pods.

### 9.4 Flow D: Jenkins automated execution

1. Choose parameters (`DEPLOY_TARGET`, `K8S_DEPLOY_METHOD`, etc.).
2. Jenkins executes full CI + package + deploy + health checks.
3. Logs remain centralized and auditable in Jenkins build history.

---

## 10. Validation and Verification Results

### 10.1 Completed checks

- Project build (`npm run build`) succeeded.
- Docker Compose config parsing (`docker compose config`) succeeded.
- Kubernetes render check (`kubectl kustomize k8s`) succeeded.
- Jenkinsfile editor diagnostics show no syntax errors.

### 10.2 Helm validation note

In this local environment, Helm CLI availability may vary. If Helm is installed on the deployment host/agent, validate with:

```bash
helm lint helm/food-app
helm template food-app helm/food-app
```

### 10.3 Validation interpretation

Current configuration is consistent and deployable across Docker and Kubernetes models, with Jenkins orchestrating either path.

---

## 11. Operational Guidance

### 11.1 Lightweight resource guidance

- Keep single replica in non-production environments.
- Preserve current conservative resource limits.
- Use `ClusterIP + port-forward` for local/dev clusters.

### 11.2 Jenkins agent requirements

For full feature support, Jenkins agent should have:

- `docker` + Compose plugin,
- `kubectl`,
- `helm` (if Helm method is used),
- Node.js/npm.

### 11.3 Secrets and credentials

- Docker push credentials in Jenkins (`docker-hub-credentials`).
- GitHub Actions secrets remain managed in repository settings.

---

## 12. Risks, Constraints, and Assumptions

1. Application is frontend-only; backend/database assumptions are out of scope.
2. Helm deploy path requires Helm binary on Jenkins agent.
3. Kubernetes deploy path requires cluster connectivity from Jenkins agent.
4. Registry/repository naming must be consistent across Jenkins and cluster pull policies.

---

## 13. Recommendations and Next Improvements

1. Standardize registry target naming between Jenkins and GHCR strategy to avoid confusion.
2. Add optional Ingress manifest and TLS path for production-like Kubernetes access.
3. Add smoke-test stage after Kubernetes deploy (HTTP check via port-forward job or in-cluster probe).
4. Add versioned release tagging strategy for immutable rollbacks.
5. Add Helm lint/template checks in Jenkins pre-deploy stage when Helm mode is selected.

---

## 14. Appendix: Commands Reference

### 14.1 Local build and validation

```bash
npm install
npm run lint
npm run type-check
npm run build
```

### 14.2 Docker

```bash
docker build -t food-app:latest .
docker compose up -d
docker compose ps
docker compose logs --tail=200
```

### 14.3 Kubernetes (kustomize)

```bash
kubectl apply -k k8s
kubectl get deploy,svc,pods -l app=food-app
kubectl port-forward svc/food-app 5173:80
```

### 14.4 Helm

```bash
helm lint helm/food-app
helm template food-app helm/food-app
helm upgrade --install food-app helm/food-app --namespace default --create-namespace
```

### 14.5 Jenkins deployment parameter examples

- Docker deploy:
  - `DEPLOY_TARGET=docker`
- Kubernetes deploy with kustomize:
  - `DEPLOY_TARGET=kubernetes`
  - `K8S_DEPLOY_METHOD=kustomize`
  - `K8S_NAMESPACE=default`
- Kubernetes deploy with Helm:
  - `DEPLOY_TARGET=kubernetes`
  - `K8S_DEPLOY_METHOD=helm`
  - `K8S_NAMESPACE=default`
  - `HELM_RELEASE=food-app`
  - `HELM_CHART_PATH=helm/food-app`

---

## Conclusion

The repository now includes a complete and practical DevOps implementation for Docker, Kubernetes, Helm, and Jenkins, while preserving existing successful GitHub Actions CI/CD behavior. The setup is purposefully lightweight, modular, and suitable for both demonstration and iterative production hardening.
