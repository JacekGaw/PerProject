# Self-Hosted Project Manager "PerProject"

Welcome to **PerProject Manager**, an open-source project management app with AI-powered features. Designed and built for teams using the **Scrum methodology**, PerProject simplifies project management with intuitive tools. It is packaged as a **Docker Compose project** for easy setup and an isolated environment, with **daily database backups** to keep your data secure.

---

## Features

- **User Authentication**: Log in using email and password.  
- **Onboarding**: A simple setup process on the first run.  
- **Dashboard**: View your most important projects and tasks.  
- **Company Management**: Create a company with details, assign user roles, and configure AI settings.  
- **Project Creation**: Set up projects with start and end dates, assign a project manager, and add detailed descriptions.  
- **Favorites**: Mark important projects for quick access on the dashboard.  
- **Task Management**: 
  - Add tasks and subtasks with attributes like importance, assignee, estimated hours, and type.  
  - AI-generated subtasks based on project and task details.  
  - Organize tasks into planned and active sprints.  
  - Use drag-and-drop functionality to move tasks between sprints.  
- **AI Retrospectives**: Automatically generate retrospectives at the end of each sprint.  
- **Custom AI Keys**: Add your OpenAI API keys for full control of AI usage.

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, React Router.  
- **Backend**: Express.js, TypeScript, Drizzle ORM (PostgreSQL), OpenAI API.  
- **Testing**: Jest, Playwright, Supertest.  
- **Build**: Docker, Vite.

---

## Installation

### Prerequisites  
Ensure **Docker** is installed on your system.

### Steps  

1. Clone this repository:  
   <pre>git clone https://github.com/JacekGaw/PerProject.git</pre>

2. Add the required variables to the `.env` files in both the **client** and **server** directories.

3. Navigate to the project's root directory and run:  
   <pre>docker compose up --build</pre>

This will install all dependencies, create the required containers, and start the application.  

### Access  
Open the app in your browser at `localhost` and the port specified in the `.env` file. On the first start, you'll be guided through a quick onboarding process to set up your company and first user.  

---

Enjoy using **PerProject Manager** to streamline your team's workflow!
