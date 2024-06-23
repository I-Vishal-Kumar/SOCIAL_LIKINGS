# **Project Name**

This project integrates a Next.js frontend with an Express.js backend. The frontend, stored in the `likings` folder, provides the user interface, while the backend, stored in the `server` folder, handles the API and business logic.

## **Table of Contents**

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running the Project](#running-the-project)

## **Installation**

To get started with this project, you need to clone the repository and install the dependencies for both the frontend and backend.

### **Clone the Repository**

```bash
git clone https://github.com/YourGitHubUsername/your-project-name.git
cd your-project-name
```
```bash
cd likings
npm install
```
```bash
cd server
npm install
```

### **setup the env files in both directories**
#### liking folder
NEXT_PUBLIC_MONGO_URI=your mongo uri
NEXT_PUBLIC_JWT_SECRET="your secret"
NEXT_PUBLIC_BACKEND_URL="your backend URL"

#### server folder
FRONTEND="your frontend URL"



