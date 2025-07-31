pipeline {
    agent any

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_IMAGE = "anshbahl7/frontend"
        PRODUCT_IMAGE = "anshbahl7/product-service"
        ORDER_IMAGE = "anshbahl7/order-service"
        USER_IMAGE = "anshbahl7/user-service"
    }

    stages {
        stage('Clone repository') {
            steps {
                git 'https://github.com/anshbahl4/microservices-ecommerce.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}", 'services/frontend')
                    docker.build("${PRODUCT_IMAGE}:${IMAGE_TAG}", 'services/product-service')
                    docker.build("${ORDER_IMAGE}:${IMAGE_TAG}", 'services/order-service')
                    docker.build("${USER_IMAGE}:${IMAGE_TAG}", 'services/user-service')
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        sh """
                        echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${PRODUCT_IMAGE}:${IMAGE_TAG}
                        docker push ${ORDER_IMAGE}:${IMAGE_TAG}
                        docker push ${USER_IMAGE}:${IMAGE_TAG}
                        """
                    }
                }
            }
        }

        stage('Deploy with Helm') {
            steps {
                withCredentials([file(credentialsId: 'KUBECONFIG', variable: 'KUBECONFIG_FILE')]) {
                    script {
                        sh """
                        export KUBECONFIG=$KUBECONFIG_FILE
                        helm upgrade --install ecommerce-app ./helm-charts/ecommerce-app \\
                          --namespace dev --create-namespace \\
                          --set frontend.image.repository=${DOCKER_IMAGE} \\
                          --set frontend.image.tag=${IMAGE_TAG} \\
                          --set product.image.repository=${PRODUCT_IMAGE} \\
                          --set product.image.tag=${IMAGE_TAG} \\
                          --set order.image.repository=${ORDER_IMAGE} \\
                          --set order.image.tag=${IMAGE_TAG} \\
                          --set user.image.repository=${USER_IMAGE} \\
                          --set user.image.tag=${IMAGE_TAG}
                        """
                    }
                }
            }
        }
    }
}
