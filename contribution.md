# Contributing to Trakg

Thank you for your interest in contributing to Trakg. This document outlines the process, standards, and expectations for contributing to the project.

---

## Getting Started

1. Fork the repository  
2. Clone your fork locally  
3. Create a new branch for your work  

git checkout -b feature/your-feature-name  

---

## Before You Start

- Check existing issues to avoid duplicate work  
- If no issue exists, create one describing:  
  - The problem  
  - Proposed solution (if any)  
- Wait for maintainers to review and assign the issue before starting work  

---

## Issue Guidelines

When creating an issue:

- Use a clear and descriptive title  
- Provide detailed context and steps to reproduce (if bug)  
- Include screenshots/logs if applicable  
- Mention affected areas (frontend, backend, etc.)  

---

## Working on the Code

- Always work on a separate branch  
- Keep changes focused and minimal  
- Avoid unrelated refactoring in the same PR  
- Follow the existing project structure  

---

## Coding Standards

### General
- Use TypeScript wherever applicable  
- Write clean, readable, and maintainable code  
- Use meaningful variable and function names  
- Avoid unnecessary complexity  

### Backend (server)
- Follow Fastify best practices  
- Use Prisma properly for DB operations  
- Validate inputs using Zod  
- Keep controllers/services modular  
- Handle errors properly  

### Frontend (trakg-v1)
- Follow React and Next.js best practices  
- Use hooks and functional components  
- Keep components reusable and modular  
- Maintain consistent UI patterns  

---

## Commit Guidelines

Use clear and meaningful commit messages:

- feat: add new feature  
- fix: fix bug  
- docs: update documentation  
- refactor: code improvements without behavior change  

Example:

feat: add lead recovery endpoint  
fix: resolve analytics data duplication issue  

---

## Running the Project

Before submitting changes:

### Backend
- Run Prisma generate and migrations  
- Ensure server starts without errors  

### Frontend
- Ensure app builds and runs correctly  

---

## Pull Request Process

1. Ensure your branch is up to date with main  
2. Push your changes  
3. Open a Pull Request  

In your PR:

- Reference the issue (e.g., Closes #12)  
- Clearly describe what you’ve done  
- Add screenshots (if UI changes)  
- Mention any breaking changes  

---

## Review Process

- Maintainers will review your PR  
- You may be asked to make changes  
- Once approved, your PR will be merged  

---

## Do’s and Don’ts

### Do
- Ask for clarification if unsure  
- Keep PRs small and focused  
- Follow coding standards  
- Respect project structure  

### Don’t
- Submit large, unrelated changes  
- Work on issues without assignment  
- Break existing functionality  
- Ignore review feedback  

---

## Need Help?

If you have questions, open an issue or start a discussion.


Thank you for contributing to Trakg.