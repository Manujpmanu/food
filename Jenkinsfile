pipeline {
    agent any

    parameters {
        choice(name: 'DEPLOY_TARGET', choices: ['docker', 'kubernetes'], description: 'Choose deployment target')
        choice(name: 'K8S_DEPLOY_METHOD', choices: ['kustomize', 'helm'], description: 'Kubernetes deploy method')
        string(name: 'K8S_NAMESPACE', defaultValue: 'default', description: 'Kubernetes namespace for deploy')
        string(name: 'HELM_RELEASE', defaultValue: 'food-app', description: 'Helm release name')
        string(name: 'HELM_CHART_PATH', defaultValue: 'helm/food-app', description: 'Helm chart path')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        NODE_ENV = 'production'
        REGISTRY = 'docker.io'
        IMAGE_NAME = 'food-ordering-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                }
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing dependencies..."
                }
                sh 'npm ci --legacy-peer-deps'
            }
        }

        stage('Code Quality Analysis') {
            steps {
                script {
                    echo "🔍 Running ESLint analysis..."
                }
                sh '''
                    npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react
                    npm run lint || true
                '''
            }
        }

        stage('Unit Tests') {
            steps {
                script {
                    echo "✅ Running unit tests..."
                }
                sh '''
                    npm test -- --coverage --passWithNoTests || true
                '''
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "🔨 Building application..."
                }
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    echo "📊 Running SonarQube analysis..."
                }
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=food-ordering-app \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=node_modules/**,dist/**,.git/** \
                            -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info || true
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                }
                sh '''
                    docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:latest
                    docker tag ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} food-app:latest
                '''
            }
        }

        stage('Docker Push') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "📤 Pushing Docker image to registry..."
                }
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME}:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "🚀 Deploying application to ${params.DEPLOY_TARGET}..."
                }
                sh '''
                    if [ "${DEPLOY_TARGET}" = "kubernetes" ]; then
                        kubectl get ns ${K8S_NAMESPACE} >/dev/null 2>&1 || kubectl create namespace ${K8S_NAMESPACE}
                        if [ "${K8S_DEPLOY_METHOD}" = "helm" ]; then
                            command -v helm >/dev/null 2>&1 || { echo "❌ helm not found on Jenkins agent"; exit 1; }
                            helm upgrade --install ${HELM_RELEASE} ${HELM_CHART_PATH} \
                              --namespace ${K8S_NAMESPACE} \
                              --create-namespace \
                              --set image.repository=${REGISTRY}/${IMAGE_NAME} \
                              --set image.tag=${IMAGE_TAG} \
                              --set fullnameOverride=food-app
                        else
                            kubectl apply -k k8s -n ${K8S_NAMESPACE}
                            kubectl set image deployment/food-app food-app=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -n ${K8S_NAMESPACE}
                        fi
                        kubectl rollout status deployment/food-app -n ${K8S_NAMESPACE} --timeout=120s
                        kubectl get all -n ${K8S_NAMESPACE}
                    else
                        docker compose down || true
                        docker compose up -d
                        docker compose ps
                    fi
                '''
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Performing health checks..."
                }
                sh '''
                    if [ "${DEPLOY_TARGET}" = "kubernetes" ]; then
                        kubectl rollout status deployment/food-app -n ${K8S_NAMESPACE} --timeout=120s
                        echo "✅ Kubernetes deployment is healthy"
                    else
                        sleep 10
                        curl -f http://localhost:5173 || exit 1
                        echo "✅ Docker deployment is healthy"
                    fi
                '''
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
            }
            cleanWs()
        }
        success {
            echo "✅ Pipeline succeeded!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
