pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "anshbahl7/frontend"
        IMAGE_TAG = "${BUILD_NUMBER}" // Correct Groovy syntax, no need for env. prefix inside env{}
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/anshbahl4/microservices-ecommerce.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Debug: Show contents to confirm Dockerfile presence
                sh 'ls -l services/frontend'
                
                // Build the Docker image
                sh 'docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} services/frontend'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy with Helm') {
            steps {
                sh '''
                    helm upgrade --install frontend ./helm-charts/frontend \
                    --namespace dev --create-namespace \
                    --set image.repository=${DOCKER_IMAGE} \
                    --set image.tag=${IMAGE_TAG}
                '''
            }
        }
    }
}
