pipeline {
    agent any

    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/anshbahl4/microservices-ecommerce.git'
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def services = ['frontend', 'product-service', 'order-service', 'user-service']
                        for (service in services) {
                            def imageName = "anshbahl7/${service}"
                            def servicePath = "services/${service}"

                            sh """
                                echo "Building image for ${service}..."
                                docker build -t ${imageName}:${IMAGE_TAG} ${servicePath}

                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                                docker push ${imageName}:${IMAGE_TAG}
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy with Helm') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh """
                        helm upgrade --install ecommerce-app ./helm-charts/ecommerce-app \
                        --namespace dev --create-namespace \
                        --set frontend.image.repository=anshbahl7/frontend \
                        --set frontend.image.tag=${IMAGE_TAG} \
                        --set product.image.repository=anshbahl7/product-service \
                        --set product.image.tag=${IMAGE_TAG} \
                        --set order.image.repository=anshbahl7/order-service \
                        --set order.image.tag=${IMAGE_TAG} \
                        --set user.image.repository=anshbahl7/user-service \
                        --set user.image.tag=${IMAGE_TAG}
                    """
                }
            }
        }
    }
}
