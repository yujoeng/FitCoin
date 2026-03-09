pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "a504-api-server"
    }
    
    stages {
        stage('Backend Build') {
            steps {(대소문자 구별)
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
                // 아까 작성하신 백엔드 전용 도면을 실행합니다.
                sh "docker compose -f docker-compose.backend.yml up -d --build"
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