# DevOps & CI/CD Report

Date: 2026-05-02

Authors: Keerthi Narayan and Monish

## Table of Contents

1. [Introduction](#1-introduction)
2. [Project Scope and System Context](#2-project-scope-and-system-context)
3. [Architecture Overview](#3-architecture-overview)
4. [Continuous Integration Process](#4-continuous-integration-process)
	- 4.5 [Jenkins Pipeline and Its Use](#45-jenkins-pipeline-and-its-use)
5. [Container Build and Registry Strategy](#5-container-build-and-registry-strategy)
6. [Continuous Deployment Process](#6-continuous-deployment-process)
7. [Security and Quality Controls](#7-security-and-quality-controls)
8. [Operational Management](#8-operational-management)
9. [Release and Recovery Procedures](#9-release-and-recovery-procedures)
10. [Migration Guidance](#10-migration-guidance)
11. [Recommendations](#11-recommendations)
12. [Appendix: Useful Commands](#12-appendix-useful-commands)

## 1. Introduction

This report documents the DevOps and CI/CD implementation for the Food App repository. The application is a frontend-only React and Vite project, and the delivery model is designed to support reproducible builds, controlled image publication, and simple container-based deployment. The document is intentionally self-contained and serves as the primary operational reference for build, deploy, security, and recovery procedures.

## 2. Project Scope and System Context

### 2.1 Application type

The repository contains a frontend-only single-page application. There is no backend service in this codebase, and deployment should therefore remain limited to the frontend runtime.

### 2.2 Core technologies

- Framework and build tool: React + Vite
- Package manager and scripts: npm
- Containerization: Docker and Docker Compose
- CI/CD provider: GitHub Actions
- Image registry: GitHub Container Registry (GHCR)
- Quality and security tooling: ESLint, TypeScript, SonarQube or SonarCloud, CodeQL, and Snyk

### 2.3 Repository artifacts

- Application scripts: `package.json`
- Production image build: `Dockerfile`
- Runtime definition: [docker-compose.yml](docker-compose.yml)
- CI workflow: `.github/workflows/ci.yml`
- Docker build and deploy workflow: `.github/workflows/docker-build.yml`
- Security workflow: `.github/workflows/security-scan.yml`

## 3. Architecture Overview

### 3.1 Delivery model

The delivery model follows a standard flow: source changes are committed, verified in CI, packaged into a container image, published to GHCR, and deployed with Docker Compose. Because the application is frontend-only, no backend service is started during deployment.

### 3.2 Operational principle

The pipeline is designed around three principles:

- reproducibility through pinned scripts and container builds,
- traceability through immutable image tags and workflow logs,
- minimal runtime scope through a frontend-only deployment definition.

### 3.3 Current implementation state

- Pushes to `main` trigger the CI workflow.
- Successful CI triggers the Docker build and deploy workflow.
- The deployment workflow ends with bounded log output rather than an open-ended log stream.

## 4. Continuous Integration Process

### 4.1 Purpose

The CI pipeline verifies correctness before any image is published or deployed. It exists to detect issues early in the lifecycle and to provide maintainers with clear job-level feedback.

### 4.2 Job sequence

The workflow is organized into the following jobs:

1. Checkout and install dependencies
2. Lint source code
3. Execute unit tests
4. Build the application
5. Run code quality analysis
6. Build and push the Docker image
7. Deploy the application

### 4.3 Job responsibilities

#### 4.3.1 Checkout and install dependencies

This job clones the repository and installs packages using `npm ci --legacy-peer-deps`. The use of deterministic installation reduces environment drift between developers and CI.

#### 4.3.2 Linting

The lint job runs ESLint against the source tree. It provides rapid feedback on syntax, style, and rule violations.

#### 4.3.3 Testing

The test job currently runs the defined test command and uploads coverage data when available. The repository may evolve toward richer test coverage, but the CI structure already reserves a distinct validation step.

#### 4.3.4 Build verification

The build job runs `npm run build` and confirms that the Vite production build completes successfully. This is the main functional gate for the frontend artifact.

#### 4.3.5 Code quality analysis

Sonar-based analysis provides static review of maintainability, complexity, and code smell indicators. It is a quality signal and not a runtime dependency.

### 4.4 Local validation command set

The local validation sequence is:

```bash
npm install
npm run lint
npm run type-check
npm run build
```

This sequence mirrors the critical logic of CI and should be used before pushing major changes.

### 4.5 Jenkins Pipeline and Its Use

Jenkins is a continuous integration and continuous delivery automation server. In this project, its purpose is to orchestrate the full software delivery process in a controlled and repeatable manner. The `Jenkinsfile` defines the pipeline as code, which makes the build and deployment process versioned alongside the application source.

#### 4.5.1 Practical use of Jenkins

Jenkins is used to automate the following activities:

1. retrieve the latest code from source control,
2. install dependencies in a clean build environment,
3. run code quality checks,
4. execute tests,
5. build the production bundle,
6. create and tag a Docker image,
7. publish the image when the branch is `main`,
8. deploy the application container,
9. verify the application health after deployment.

#### 4.5.2 Pipeline structure in this repository

The `Jenkinsfile` follows a staged pipeline model. The configured stages are:

- Checkout,
- Install Dependencies,
- Code Quality Analysis,
- Unit Tests,
- Build,
- SonarQube Analysis,
- Docker Build,
- Docker Push,
- Deploy,
- Health Check.

#### 4.5.3 Why Jenkins is useful

Jenkins is useful because it provides centralized automation for build, test, scan, package, and deploy operations. It reduces manual work, improves consistency, and makes the delivery process auditable. For a mini project, it demonstrates a complete DevOps workflow from source code to deployment.

#### 4.5.4 Summary of Jenkins in this project

In this repository, Jenkins acts as the orchestration layer for the CI/CD process. It complements the Docker-based deployment model and shows how a project can be built, tested, scanned, containerized, and deployed in an automated pipeline.

## 5. Container Build and Registry Strategy

### 5.1 Docker build approach

The application is packaged using a multi-stage Docker build. This reduces runtime size and ensures that the production image contains only the necessary static output and serving configuration.

### 5.2 Build tooling

Docker Buildx is used for the container build stage. Registry-backed caching reduces build time for repeated runs.

### 5.3 Registry strategy

GHCR stores the published image. Tags are derived from branch, commit SHA, and release metadata where applicable. This ensures that each production deployment can be traced back to a concrete source state.

### 5.4 Image naming rules

Image references are lowercased to satisfy registry requirements. The canonical image pattern is `ghcr.io/keerthinarayan/food-app`.

## 6. Continuous Deployment Process

### 6.1 Trigger mechanism

After CI completes successfully, a `workflow_run` event triggers the Docker build and deploy workflow. This separation ensures that deployment only occurs after the main validation pipeline succeeds.

### 6.2 Deployment sequence

The deployment workflow performs the following operations:

1. Pull the current image.
2. Start the compose stack.
3. Display service status.
4. Emit bounded logs.

The bounded log output is important because it prevents the workflow from remaining active indefinitely.

### 6.3 Compose model

The compose file defines a single frontend service. Because the repository does not contain backend code, no `api-server` or database service should be introduced into the runtime model.

### 6.4 Deployment verification

The expected deployment outcome is a running frontend container that responds on the configured port and passes its health check.

## 7. Security and Quality Controls

### 7.1 Static analysis

ESLint and TypeScript type checking provide baseline code correctness and consistency checks.

### 7.2 Software composition analysis

Snyk and npm audit are intended to identify dependency vulnerabilities. These checks support dependency hygiene and risk visibility.

### 7.3 Application security analysis

CodeQL provides source-level security review. Sonar-based tools contribute maintainability and defect indicators.

### 7.4 Secret management

Secrets must be stored in GitHub secrets rather than committed to source control. Typical secrets include `SONAR_TOKEN`, `SNYK_TOKEN`, and any private access tokens required for repository automation.

## 8. Operational Management

### 8.1 Monitoring

The current deployment model includes a basic container health check. For operational maturity, external uptime monitoring and centralized log aggregation are recommended.

### 8.2 Incident handling

If deployment fails, operators should verify three points in order:

1. the CI workflow completed successfully,
2. the image exists in GHCR,
3. the compose file matches the frontend-only architecture.

### 8.3 Rollback

Rollback is performed by redeploying a previous known-good image tag. This is the safest recovery mechanism because the release is tied to an immutable artifact.

### 8.4 Environment separation

Development, CI, and production should remain distinct. Local development uses Vite directly, CI runs in GitHub-hosted runners, and production uses Docker Compose on a host with the Compose plugin installed.

## 9. Release and Recovery Procedures

### 9.1 Release model

The release model should use annotated tags such as `v1.0.0`. A release workflow can build the image, tag it, publish it, and optionally create GitHub Release notes.

### 9.2 Release validation

Before release, the following conditions should be satisfied:

- the application builds successfully,
- the image is published to GHCR,
- the deployment host can pull the image,
- the frontend loads correctly in the browser.

### 9.3 Recovery model

Recovery should use the last known-good image rather than rebuilding under pressure. This reduces operational risk and provides a clear rollback path.

## 10. Migration Guidance

### 10.1 Node 24 compatibility

GitHub Actions currently reports Node.js 20 deprecation warnings for several actions. This is not an immediate blocker because the workflows are succeeding, but it is a required maintenance item for long-term stability.

### 10.2 Safe upgrade path

1. Review the currently used Actions versions.
2. Update one workflow at a time.
3. Re-run the workflow after each change.
4. Confirm checkout, buildx, registry login, metadata generation, and image push still succeed.
5. Record the verified versions in this report.

### 10.3 Priority order

The practical order of maintenance work is:

1. keep the report self-contained,
2. maintain the frontend-only deployment model,
3. update workflow actions for Node 24 compatibility,
4. add more advanced release automation only after the base pipeline remains stable.

## 11. Recommendations

1. Keep the report in a single file so that it remains a complete operational reference.
2. Preserve the frontend-only compose model and avoid adding backend placeholders.
3. Update GitHub Actions dependencies to Node 24–compatible versions when time permits.
4. Add a release workflow if versioned production deployments are required.
5. Add external monitoring and centralized logging if the deployment is used in a production setting.

## 12. Appendix: Useful Commands

### 12.1 Local development

```bash
npm install
npm run dev
```

### 12.2 Local validation

```bash
npm run lint
npm run type-check
npm run build
```

### 12.3 Container build and run

```bash
npm run docker:build
npm run docker:run
```

### 12.4 Deployment troubleshooting

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=200
```

## 13. Conclusion

This report now presents the DevOps implementation in a formal, structured format. It describes the project context, CI/CD flow, container strategy, deployment procedure, security controls, operational practices, recovery approach, and future migration priorities in a single self-contained document.


