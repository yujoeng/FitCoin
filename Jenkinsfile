pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "api-server"
    }

    stages {
        stage('Prepare Env Files') {
            steps {
                withCredentials([file(credentialsId: 'backend_env', variable: 'BACKEND_ENV')]) {
                    sh "cp \$BACKEND_ENV Backend/fitCoin/.env"
                }
                withCredentials([file(credentialsId: 'frontend_env', variable: 'FRONTEND_ENV')]) {
                    sh "cp \$FRONTEND_ENV Frontend/fitCoin/.env"
                }
            }
        }

        stage('Frontend Docker Build') {
            steps {
                sh "docker build -f Frontend/fitCoin/Dockerfile -t nextjs_app:latest ."
            }
        }

        stage('Frontend Deploy') {
            steps {
                sh "docker compose -f ./Infra/docker-compose.frontend.yml up -d"
            }
        }

        stage('Backend Docker Build') {
            steps {
                dir('Backend/fitCoin') {
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Backend Deploy') {
            steps {
                sh "docker compose -f ./Infra/docker-compose.backend.yml up -d"
            }
        }

        stage('Cleanup') {
            steps {
                sh "docker image prune -f"
            }
        }
    }
}