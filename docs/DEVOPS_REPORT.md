# DevOps & CI/CD Report — Food App

Date: 2026-05-02

Author: Automated DevOps Assistant

## Summary

This document describes the DevOps design, CI/CD pipelines, deployment flow, security and quality tooling, operational runbooks, and recommendations for the Food App repository. It is written as a report to guide maintainers and operators through the build → test → release → operate lifecycle for this frontend-only Vite application.

## Scope

- Repository type: frontend-only Vite + React application (see `package.json`).
- CI provider: GitHub Actions (workflows in `.github/workflows/`).
- Containerization: Docker (multi-stage Dockerfile), image hosting on GitHub Container Registry (GHCR).
- Deployment model: Docker Compose on a hosting VM or runner that supports the `docker compose` plugin.

## Goals

- Provide a robust CI pipeline for linting, testing, building and scanning.
- Produce reproducible, cache-optimized container images and push them to GHCR.
- Deploy the frontend minimal stack via `docker compose` (frontend only).
- Enforce quality and security gates (SonarQube, Snyk, CodeQL).
- Provide clear runbooks for deployment, rollback, monitoring, and incident response.

## Repository & Key Files

- Project root: `package.json` — scripts and build targets.
- Container config: `Dockerfile` — multi-stage build for production image.
- Deployment compose: [docker-compose.yml](docker-compose.yml) — frontend service only.
- Workflows: `.github/workflows/ci.yml`, `.github/workflows/docker-build.yml`, `.github/workflows/security-scan.yml`.
- Docs and runbooks: `docs/`.

## High-level Architecture

1. Developer push / PR triggers the CI workflow.
2. CI jobs run in the following logical order: checkout → install → lint → test → build → artifact upload → container build & push → deploy.
3. Docker image is built by `docker/build-push-action@v5` (uses Buildx) and pushed to GHCR with tags generated from git metadata.
4. A separate `workflow_run` (Docker Build & Deploy) picks up successful CI runs and deploys using `docker compose` on the runner/host.

## Detailed CI Flow

The CI workflow (`CI/CD Pipeline`) is organized into jobs with explicit dependencies to allow parallelization where safe and sequential gating where required.

### Jobs and responsibilities

- `checkout-and-install`: clones repository and runs `npm ci --legacy-peer-deps` to install deterministic dependencies.

- `lint`: installs ESLint dev dependencies and runs `npm run lint` (configured to not fail the workflow by default to avoid blocking urgent fixes; consider changing to fail on error once linting is stabilized).

- `test`: runs unit tests (currently stubbed) and uploads coverage to Codecov.

- `build`: runs `npm run build` to produce a `dist/` artifact; artifact is uploaded with `actions/upload-artifact@v4` for later stages or for artifact inspection.

- `sonarqube`: performs a SonarCloud/Server scan using SonarSource action; configured to run with `continue-on-error: true` so scans do not block deployments but still provide feedback.

- `docker-build`: builds and pushes container images to GHCR using Buildx with cache-from/cache-to support.

- `deploy`: uses `docker compose` to bring up services on the runner or host and performs a simple health-check against the frontend port.

### Important configuration notes

- Node version is set via `env.NODE_VERSION: '18'` in the workflows. GitHub Actions runner deprecations (Node.js 20 → 24) are annotated in the Actions UI; plan to update actions or opt-in to Node 24 per the repository policy before the deprecation deadlines.

- The image naming is lowercased to comply with container registry rules: `ghcr.io/keerthinarayan/food-app`.

## Container Build & Push

### Build strategy

- Use Docker Buildx for multi-platform and cache support.
- Use `cache-from` and `cache-to` (registry-backed) to speed up repeat builds in CI.
- Tag images with branch/sha/semver metadata produced by `docker/metadata-action`.

### Image lifecycle and tags

- `latest` — only for default branch builds (short-lived; useful for quick tests).
- `sha-<commit>` — immutable, used for reproducibility.
- Optional: semver tags for releases (use a release job that creates semver tags).

## Registry & Permissions

- GHCR is used as the registry. Ensure `GITHUB_TOKEN` or a PAT with `packages: write` and `workflow` scopes is available for the publish step.
- Workflows must run with `permissions.packages: write` when pushing images.

## CD / Deployment Flow

### Trigger mechanism

- CI completes successfully → `workflow_run` event triggers the Docker Build & Deploy workflow which runs the push and then deploys.

### Deployment steps (as implemented)

1. Pull images: `docker compose pull`.
2. Start services: `docker compose up -d`.
3. Show service status: `docker compose ps`.
4. Output recent logs (bounded) via `docker compose logs --tail=200`.

Note: Do not use `docker-compose` (dash) — GitHub-hosted runners use the `docker compose` plugin.

## Branching & Release Strategy

- Recommended: Git branching model with `main` (production), `develop` (integration), feature branches and PRs.
- `main` push triggers deployment; use protected branches + required checks (build, lint, tests, Sonar) before merging.
- Releases: create annotated git tags (vMAJOR.MINOR.PATCH) and a release job that builds images with semver tags and optionally creates a GitHub Release.

## Quality & Security Gates

- Static code analysis: ESLint (frontend rules), TypeScript type-check.
- SonarCloud/Server: detect code smells, bugs, coverage metrics.
- Dependency scanning: Snyk / npm audit — run in CI and fail PRs on high severity (policy decision).
- CodeQL: security analysis on push/PR.

## Secrets & Credentials

- Store secrets in GitHub repo/org `Secrets`: `GITHUB_TOKEN` (automatically provided), `SONAR_TOKEN`, `SNYK_TOKEN`, any PATs.
- Avoid embedding credentials in the repo or images. Use environment variables injected at runtime via the host's `docker compose` environment file or secrets manager.

## Environment Management

- Local developer: run `npm run dev` (Vite) or `npm run docker:build` + `npm run docker:run` for containerized testing.
- CI: runs builds inside ephemeral runner VMs; caches configured for Node modules and Docker layers.
- Production: run the `docker compose` stack on a VM or host with Docker and the Compose plugin.

## Health, Monitoring & Observability

- Basic health check: the frontend `healthcheck` endpoint is configured in `docker-compose.yml` to probe the Vite server.
- Recommended: add a lightweight metrics/uptime check (external synthetic checks like UptimeRobot) and expose application logs to a centralized logging system (ELK, Loki, or cloud provider logging).
- Add basic metrics and alerts for build failures, deploy failures, and image push errors.

## Rollback & Blue/Green / Canary Patterns

- For this frontend-only app, simplest rollback is to re-deploy the previous immutable image (tagged by SHA).
- For more advanced safety, adopt a canary deploy: ship `sha` tagged image to a canary instance, run smoke tests, then flip traffic.

## Runbook (Deployment Failure)

If `Docker Build & Deploy` appears stuck or fails:

1. Inspect the failing workflow run in Actions for logs and error messages.
2. Confirm image push succeeded — check GHCR package list for the repository.
3. SSH into target host (if deployment host differs) and run:

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=200
```

4. If a container crashes due to missing scripts (example: `npm error Missing script: "server"`), verify `package.json` scripts; for frontend-only repos, remove backend services to avoid starting nonexistent processes (this repo has been adjusted accordingly).
5. Rollback: deploy the previous `sha-<commit>` image tag.

## Operational Checklist

- Ensure `GITHUB_TOKEN` has correct permissions for workflow actions pushing images.
- Monitor Actions for Node runtime deprecation warnings and plan upgrades.
- Protect `main` branch and require CI checks before merge.
- Periodically rotate tokens and audit secrets.

## Security & Compliance

- Run CodeQL and Snyk on PRs to prevent introducing known vulnerabilities.
- Enforce dependency policies (denylist/EOL packages) via Snyk or similar.

## Maintenance & Upgrades

- Keep GitHub Actions actions up-to-date (watch for Node runtime compatibility).
- Keep Docker base images updated (security patches). Use Dependabot or automated image scanning.

## Recommendations & Next Steps

1. Harden CI by making lint and critical scans (vulnerabilities) fail PRs once baseline fixes are implemented.
2. Add release tagging and a `release` workflow that creates semver tags and generates changelogs.
3. Add automated smoke tests after `docker compose up` to validate runtime behavior.
4. Add centralized logging and simple monitoring (uptime checks, error rate alerts).
5. Create a small runbook document for common incidents, with exact commands to run on the deployment host.

## Appendix A — Useful Commands

- Local development

```bash
npm install
npm run dev
```

- Build and run container locally

```bash
npm run docker:build
npm run docker:run
```

- CI deployment host troubleshooting

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=200
```

## Appendix B — Where to look in this repo

- CI pipeline: `.github/workflows/ci.yml` and `.github/workflows/docker-build.yml`.
- Compose deployment file: [docker-compose.yml](docker-compose.yml).
- Build config: `Dockerfile`.

## Closing

This report captures the current DevOps implementation, decisions made (frontend-only), and recommended improvements. If you want, I can:

- expand this into separate runbooks (deployment, rollback, incident playbook),
- add a release workflow with semver tagging, or
- upgrade Actions to Node 24-compatible versions and test a dry-run.

-- End of report
