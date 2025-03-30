
# University Complaints Management System

## Overview

The University Complaints Management System is a web-based platform that streamlines the process of submitting, tracking, and resolving student complaints. It replaces traditional physical complaint letters with an efficient digital solution.

## Features

### For Students
- Submit complaints for specific courses
- Track complaint status (Pending, In Progress, Resolved)
- Receive updates on complaint progress
- Respond to lecturer feedback
- View complaint history with timestamps

### For Lecturers
- Access a dashboard of all student complaints for assigned courses
- Update complaint status (Pending, In Progress, Resolved)
- Respond to student complaints
- Organize and filter complaints by status
- Archive resolved complaints

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router for navigation
- React Query for state management

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd university-complaints-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Accounts

### Student Accounts
- Email: john@university.edu (Password: any)
- Email: jane@university.edu (Password: any)
- Email: alex@university.edu (Password: any)
- Email: sarah@university.edu (Password: any)
- Email: michael@university.edu (Password: any)

### Lecturer Accounts
- Email: rbrown@university.edu (Password: any)
- Email: ewhite@university.edu (Password: any)
- Email: jsmith@university.edu (Password: any)
- Email: lchen@university.edu (Password: any)

## Project Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers
- `/src/hooks`: Custom React hooks
- `/src/pages`: Page components for different routes
- `/src/services`: Service functions for data management
- `/src/types`: TypeScript type definitions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
