# GitHub Actions Secrets Setup

## Required Secrets

Go to: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 1. Docker Hub Credentials
**Name:** `DOCKER_TOKEN`
- Value: Your Docker Hub personal access token
- Generate at: https://hub.docker.com/settings/security

**Name:** `DOCKER_USERNAME`
- Value: Your Docker Hub username

### 2. SonarCloud
**Name:** `SONAR_TOKEN`
- Value: SonarCloud token
- Generate at: https://sonarcloud.io/account/security

### 3. Snyk (Optional)
**Name:** `SNYK_TOKEN`
- Value: Snyk API token
- Generate at: https://app.snyk.io/account/api-token

## GitHub Token (Automatic)
- `GITHUB_TOKEN` is automatically available in workflows
- No manual configuration needed

## Optional: Registry Credentials

For private registries, add:

**Name:** `REGISTRY_USERNAME`
- Value: Registry username

**Name:** `REGISTRY_PASSWORD`
- Value: Registry password/token

## Verify Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see all configured secrets
3. Click on a secret to verify (can't see the value, only that it exists)

## Using Secrets in Workflows

Secrets are accessed using: `${{ secrets.SECRET_NAME }}`

Example:
```yaml
env:
  DOCKER_USER: ${{ secrets.DOCKER_USERNAME }}
```

## Security Best Practices

✅ **Do:**
- Use personal access tokens instead of passwords
- Rotate tokens regularly
- Limit token scopes to minimum required
- Review secret usage in workflows

❌ **Don't:**
- Commit secrets to repository
- Share tokens in issues/discussions
- Use the same token for multiple services
- Log or echo secrets in workflow output

## Troubleshooting

### Secret Not Found Error
- Verify secret name spelling
- Ensure secret is in correct repository
- Check repository settings access

### Access Denied
- Verify token has required permissions
- Check token hasn't expired
- Regenerate token if needed
