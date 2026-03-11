pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "a504-api-server"
    }

    stage('Frontend Build & Deploy') {
        steps {
            sh "docker-compose -f ./Infra/docker-compose.frontend.yml up -d --build"
        }
    }

    stages {
        stage('Backend Build') {
            steps {
                dir('Backend') {
                    sh 'chmod +x gradlew'
                    sh './gradlew clean build -x test' 
                }
            }
        }

        stage('Docker Build') {
            steps {
                dir('Backend') {
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Deploy') {
            steps {
                sh "docker-compose -f ./Infra/docker-compose.backend.yml up -d"
            }
        }
        
        stage('Cleanup') {
            steps {
                sh "docker image prune -f"
            }
        }

        // stage('Clone') {
        //     steps {
        //         git branch: 'develop', credentialsId: 'dabinchi388', url: 'https://lab.ssafy.com/s14-fintech-finance-sub1/S14P21A504.git'
        //     }
        // }
    }
}