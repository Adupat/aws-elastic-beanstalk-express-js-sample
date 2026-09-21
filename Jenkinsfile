pipeline{
    
    agent any

    // Define environment variables
    environment {
        DOCKER_REGISTRY = 'adupat'
        APP_NAME = 'aws-elastic-beanstalk-express-js-sample'
        IMAGE_TAG = "${DOCKER_REGISTRY}/${APP_NAME}:LATEST"

        // Connection to the Docker-in-Docker daemon running on the host machine
        DOCKER_HOST = 'tcp://docker:2376'
        DOCKER_TLS_VERIFY = '1'
        DOCKER_CERT_PATH = '/certs/client'
    }

    // Define the stages of the pipeline
    stages {

        // Install Dependencies
        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:16'
                    args '-u root:root'
                    reuseNode true
                }
            }

            // Steps to install dependencies
            steps {
                echo 'Installing dependencies ....'
                sh 'npm ci'
            }
        }
        
        // Run Unit Tests
        stage('Run Unit Tests') {
            agent {
                docker {
                    image 'node:16'
                    args '-u root:root'
                    reuseNode true
                }
            }

            // Steps to run unit tests
            steps {
                echo 'Running unit tests ....'
                sh 'npm test'
            }

        }

        // Run Security Scan
        stage('Security Scan') {
            agent {
                docker {
                    image 'node:16'
                    args '-u root:root'
                    reuseNode true
                }
            }

            // Steps to run security scan using Snyk
            steps {
                echo 'Scanning for security vulnerabilities ....'
                withCredentials([
                    string(
                        credentialsId: 'snyk-token',
                        variable: 'snyk_token'
                    )
                ]) {
                    sh 'npm install -g snyk'
                    sh 'snyk auth $snyk_token'
                    sh 'snyk test --severity-threshold=high'
                }
            }
        }

        // Build Docker Image
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image....'
                sh "docker build -t ${IMAGE_TAG} ."
            }
        }

        // Push Docker Image to Registry
        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker Image to Registry....'
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    sh "docker push ${IMAGE_TAG}"
                }
            }
        }
    }
}