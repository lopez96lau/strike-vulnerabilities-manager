# Strike Vulnerabilities Manager

A modern web application for managing and tracking security vulnerabilities across different stages of their lifecycle.

![Strike Vulnerabilities Manager](public/assets/icons/logo.svg)

## Overview

Strike Vulnerabilities Manager is a Kanban-style board application that helps security teams track and manage vulnerabilities through different states, from discovery to resolution. It provides a drag-and-drop interface, filtering capabilities, and detailed vulnerability management.

## Features

- **Kanban Board**: Visual management of vulnerabilities across different states
- **Drag & Drop**: Intuitive status changes through drag and drop
- **Filtering & Sorting**: Filter vulnerabilities by severity and sort by multiple criteria
- **Responsive Design**: Full functionality on both desktop and mobile devices
- **Real-time Updates**: Immediate reflection of status changes and updates

## Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router) + React 19
- **UI Components**: Geist UI
- **Styling**: Tailwind CSS
- **Drag & Drop**: dnd-kit
- **State Management**: React Hooks

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM + Railway

## Architecture

### Directory Structure

```plaintext
/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   └── page.tsx          # Main application page
├── components/           # React components
├── hooks/                # Custom React hooks
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── utils/                # Utility functions
```

### Database Schema

```prisma
model Vulnerability {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  severity    String
  status      String
  evidence    String?
  assignedTo  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Business Rules

### Vulnerability States

1. **Reported**
   - Initial state for new vulnerabilities
   - No requirements for transition
   - Represents initial discovery
2. **Pending Fix**
   - Initial state for new vulnerabilities
   - No requirements for transition
   - Represents initial investigation and analysis in order to determine the root cause
3. **In Progress**
   - Requires an assigned user
   - Indicates active work on the vulnerability
4. **Validation**
   - Requires assigned user and evidence
   - Used for verification of fixes based on the provided evidence
5. **False Positive**
   - Requires assigned user and evidence
   - Used when vulnerability is confirmed as not valid
6. **Solved**
   - Requires assigned user and evidence
   - Final state for resolved vulnerabilities

### State Transition Rules

- Cannot move to "In Progress" without assignment
- Cannot move to "Validation", "False Positive", or "Solved" without both assignment and evidence

### Severity Levels (CVSS v3.1)

Vulnerabilities are classified according to the Common Vulnerability Scoring System (CVSS) v3.1:

1. **Critical** (9.0-10.0)

   - Vulnerabilities that pose an immediate threat
   - Require immediate attention and remediation
   - Usually allow complete system compromise

2. **High** (7.0-8.9)

   - Significant vulnerabilities with substantial impact
   - Should be addressed in short term
   - May allow partial system compromise

3. **Medium** (4.0-6.9)

   - Moderate risk vulnerabilities
   - Should be addressed in normal course of business
   - Limited impact on system security

4. **Low** (0.1-3.9)

   - Minor vulnerabilities with minimal impact
   - Can be addressed as resources permit
   - Minimal threat to system security

5. **None** (0.0)
   - No impact on system security
   - Usually used for informational findings
   - No immediate action required

Each severity level affects prioritization in the Kanban board and helps teams focus on the most critical issues first.

### Adding New Vulnerabilities

#### CWE Integration

The application integrates with Common Weakness Enumeration (CWE), a community-developed list of software and hardware weakness types. When adding a new vulnerability, users can:

1. **Search CWE Database**

   - Search by CWE ID (e.g., CWE-79)
   - View detailed descriptions, common consequences and mitigations

2. **Auto-population**
   - Once a CWE is selected, the following fields are automatically populated:
     - Weakness type
     - Common consequences
     - Potential mitigations
     - Related attack patterns

#### Required Fields

When creating a new vulnerability, the following information is required:

1. **Basic Information**

   - Title (autocompleted through CWE search)
   - Description (autocompleted through CWE search)
   - CWE Reference
   - Severity (through CVSS v3.1 score)
   - Status (automatically set to "Reported")

2. **Optional Fields**

   - Assigned user (can be selected later)
   - Evidence (can be provided as an URL later)

3. **Default Values**
   - Status: Automatically set to "Reported"
   - Creation Date: Current timestamp
   - Last Modified: Current timestamp

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/lopez96lau/strike-vulnerabilities-manager.git
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up the database

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

## Environment Variables

Create a .env file with:

```plaintext
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
