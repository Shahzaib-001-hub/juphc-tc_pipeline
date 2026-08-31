# Tax Calculator Cloud-Native DevOps Application

An automated Node.js web application and CI/CD pipeline built with Express, Jasmine, Docker, Kubernetes, and Tekton for IBM Cloud.

## Project Structure

```
├── .tekton/
│   ├── tasks/
│   │   ├── unit-test-task.yaml    # Jasmine Unit Testing Task
│   │   ├── build-push-task.yaml   # Kaniko / Buildah Image Builder
│   │   └── deploy-task.yaml       # Kubernetes Deployment Task
│   ├── pipeline.yaml              # Tekton CI/CD Pipeline
│   └── pipelinerun.yaml           # Tekton PipelineRun Definition
├── k8s/
│   ├── deployment.yaml            # Kubernetes Deployment Manifest
│   └── service.yaml               # Kubernetes Service Manifest
├── public/
│   ├── index.html                 # Frontend Web UI
│   ├── style.css                  # UI Stylesheet
│   └── script.js                  # Client logic
├── spec/
│   ├── support/jasmine.json       # Jasmine configuration
│   └── taxCalculator.spec.js      # Unit tests
├── src/
│   └── taxCalculator.js           # Tax calculation business logic
├── app.js                         # Express Web Server
├── Dockerfile                     # Container definition
├── package.json                   # Dependencies and scripts
└── README.md
```

## Running Locally

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Start the web application
npm start
```
Access at `http://localhost:3000`.

## Docker Commands

```bash
# Build the Docker image
docker build -t tax-calculator:v1.0 .

# Run the container
docker run -d -p 3000:3000 --name tax-calc-app tax-calculator:v1.0
```

## Tekton CI/CD Pipeline Execution

```bash
# Apply Tekton Tasks and Pipeline
kubectl apply -f .tekton/tasks/
kubectl apply -f .tekton/pipeline.yaml

# Trigger Pipeline
kubectl create -f .tekton/pipelinerun.yaml
```
