pipeline {
    agent any

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
                    echo "🚀 Deploying application..."
                }
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                    docker-compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "🏥 Performing health checks..."
                }
                sh '''
                    sleep 10
                    curl -f http://localhost:5173 || exit 1
                    echo "✅ Application is healthy"
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
