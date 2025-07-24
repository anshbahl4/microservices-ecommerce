pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "anshbahl4/frontend" // Change as needed
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/anshbahl4/microservices-ecommerce.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$IMAGE_TAG ./services/frontend'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_IMAGE:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy with Helm') {
            steps {
                sh """
                  helm upgrade --install frontend ./helm-charts/frontend \
                  --namespace dev --create-namespace \
                  --set image.repository=$DOCKER_IMAGE \
                  --set image.tag=$IMAGE_TAG
                """
            }
        }
    }
}
