# CI/CD Pipeline: Node.js → Docker → GitHub Actions → AWS ECR → EC2

![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=githubactions)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![AWS](https://img.shields.io/badge/AWS-ECR%20%2B%20EC2-FF9900?logo=amazonaws)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)
![License](https://img.shields.io/badge/License-MIT-green)

A production-style, end-to-end CI/CD pipeline for a Node.js Express app 

Every push to `main` automatically lints, tests, builds a Docker image, pushes it to AWS ECR, and deploys it to a live EC2 server.

---

## Live Demo

```
http://16.16.24.121/
```

## Pipeline Overview

```
Git Push to main
       │
       ▼
┌────────────┐     ┌────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Stage 1  │────▶│   Stage 2  │────▶│    Stage 3      │────▶│   Stage 4   │
│    Lint    │     │    Test    │     │  Build & Push   │     │   Deploy    │
│  (ESLint)  │     │   (Jest)   │     │  Docker → ECR   │     │    EC2      │
└────────────┘     └────────────┘     └─────────────────┘     └─────────────┘
```

| Stage | Tool | What it does |
|-------|------|-------------|
| Lint | ESLint | Catches code style errors before they ship |
| Test | Jest + Supertest | Runs unit tests, enforces ≥80% coverage |
| Build | Docker + ECR | Builds a multi-stage image, tags with Git SHA, pushes to registry |
| Deploy | SSH + Docker | Pulls new image on EC2, swaps container with zero downtime |

> Stages 3 and 4 only run on pushes to `main` — not on pull requests.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| App | Node.js, Express |
| Containerization | Docker (multi-stage build) |
| CI/CD | GitHub Actions |
| Image Registry | AWS ECR |
| Hosting | AWS EC2 (Amazon Linux 2023) |
| Testing | Jest, Supertest |
| Linting | ESLint |

---

## Project Structure

```
my-cicd-project/
├── app/
│   ├── index.js                  # Express app (/, /health endpoints)
│   ├── package.json              # Dependencies + npm scripts
│   └── __tests__/
│       └── app.test.js           # Jest unit tests
├── Dockerfile                    # Multi-stage build (builder + runtime)
├── .dockerignore                 # Keeps image lean
├── .eslintrc.json                # ESLint rules
└── .github/
    └── workflows/
        └── cicd.yml              # Full 4-stage pipeline definition
```

---

## Getting Started



### Local Development

```bash
# Install dependencies
cd app
npm install

# Run lint
npm run lint

# Run tests with coverage
npm test

# Start the server
npm start
# → http://localhost:3000
```

### Run with Docker Locally

```bash
# Build the image
docker build -t my-cicd-app .

# Run the container
docker run -p 3000:3000 my-cicd-app

# Test it
curl http://localhost:3000/health
# → { "status": "ok" }
```

---

## AWS Setup

### 1. Create ECR Repository Using AWS Management Console

### 2. Create IAM User for GitHub Actions

Attach the `AmazonEC2ContainerRegistryFullAccess` policy, then generate an access key.

### 3. Launch EC2 Instance

- AMI: Amazon Linux 2023
- Type: t3.micro (free tier)
- Security group: open port 22 (SSH) and port 80 (HTTP)

SSH in and install Docker:

```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -aG docker ec2-user
sudo yum install -y aws-cli
```

Attach an IAM role with `AmazonEC2ContainerRegistryReadOnly` to the EC2 instance.

---

## GitHub Secrets

Navigate to **Settings → Secrets and variables → Actions** in your repo and add:

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | IAM user access key ID |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key |
| `EC2_HOST` | EC2 public IP address |
| `EC2_USER` | `ec2-user` |
| `EC2_SSH_KEY` | Full contents of your `.pem` private key file |

---

## How the Deploy Works

When a push lands on `main`:

1. GitHub Actions SSHes into the EC2 instance
2. EC2 authenticates with ECR using its IAM role
3. Pulls the new Docker image (tagged with the Git SHA)
4. Stops and removes the old container
5. Starts the new container on port 80
6. Runs a health check to confirm it's live

No downtime window — the old container stays up until the new one is ready to replace it.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Returns app info (message, version, environment) |
| GET | `/health` | Health check — returns `{ "status": "ok" }` |

---

## What I Learned

- Dockerizing a Node.js app using a multi-stage build for a smaller, more secure image
- Writing a GitHub Actions workflow with dependent job stages
- Managing AWS IAM users, roles, and least-privilege permissions
- Pushing and pulling Docker images from AWS ECR
- Deploying to EC2 via SSH with automatic container swapping
- Storing secrets securely using GitHub Actions secrets

---

## Author

**Thixxa** — DevOps Engineer 


---
