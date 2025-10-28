# Internship Management System

## Introduction
The **Internship Management System** is a comprehensive solution designed to centralize and optimize the internship management process in academic and professional contexts. This system allows tracking the full internship lifecycle, from assignment to final evaluation, involving three main user types: **Administrators**, **Tutors**, and **Interns**.

This application serves educational institutions and companies by providing a centralized platform to store information, manage evaluations, and facilitate communication among all stakeholders.

---

## Technologies and Tools

### Backend - Spring Boot
The backend is built with **Spring Boot**, following the **MVC (Model-View-Controller)** architecture:

- **Models (Entities):** Represent database tables using JPA/Hibernate. Key entities include `Person`, `Admin`, `Tutor`, `Intern`, `Internship`, `Period`, and evaluation-related classes.
- **Repositories:** Interfaces extending `JpaRepository` for database operations, with custom queries for complex requirements.
- **DTOs (Data Transfer Objects):** Used for transferring only necessary data between backend and frontend.
- **Services:** Encapsulate business logic and coordinate operations between repositories and controllers.
- **Controllers:** REST API endpoints for handling HTTP requests, organized by functional domain (e.g., `AdminController`, `InternshipController`).

### Frontend - React.js with Tailwind CSS
The frontend is developed using **React.js**:

- **Components:** Reusable and modular UI components.
- **React Router:** For route management.
- **React Hooks:** State and effect management (`useState`, `useEffect`).
- **Context API:** Global state management.
- **Axios:** API calls to the backend.

**Design & UX with Tailwind CSS:**

- Utility-first CSS framework for modern, responsive design.
- Consistent UI components across the application.
- Fully responsive design for desktop, tablet, and mobile devices.
- Custom theme matching the application branding.

**Data Visualization:**

- **Recharts:** Graphs and dashboards.
- **jsPDF:** Generating downloadable evaluation reports in PDF format.

---

## User Roles & Features

### Administrator
The administrator oversees the system:

- **User Management:** Create accounts, assign roles, update or deactivate profiles.
- **Dashboard:** System statistics, evaluation distribution, general averages, top companies hosting interns, top institutions, activity tracking.

### Tutor
The tutor supervises interns and manages evaluations:

- **Evaluation Management:** Create, edit, and complete evaluation forms.
- **Forms Include:** Internship objectives, company context, global appreciation, evaluation of professional, scientific/technical, specific, and student competencies.
- **Dashboard:** Lists supervised interns, stage status, evaluation stats, and reminders.

### Intern
The intern accesses personal internship information:

- **Consultation:** View all internships, host company info, completed evaluations, and supervising tutors.
- **Features:** Download evaluation reports in PDF, track skill progression, review appreciation summaries.

---

## Workflow
1. Administrator creates accounts for tutors and interns.
2. Tutor registers internship details (objectives, company info).
3. Tutor completes evaluation forms during or after the internship.
4. Intern views evaluations and downloads reports.
5. Administrator oversees the entire process and accesses global statistics.

---

## Data Model
The relational database includes main entities:

- **Person:** Base entity with common user information.
- **Admin, Tutor, Intern:** Specialized entities inheriting from Person.
- **Internship:** General internship information.
- **Period:** Links an intern, tutor, and internship for a defined period.
- **Evaluations:** Multiple tables for different evaluation aspects:
  - Global appreciation
  - Professional competence
  - Student competence
  - Scientific/technical competence
  - Specific competences

---

## Dashboards & Interfaces

### Administrator Dashboard
- Overview of users (interns, tutors, admins)
- System activity (evaluations created per month/year)
- Evaluation distribution by competence
- General averages by institution and company
- Top 5 companies and institutions

### Tutor Dashboard
- List of supervised interns (ongoing, completed, pending)
- Evaluation statistics

### Intern Interface
- View internships and associated dates/companies
- Access completed evaluations
- Track supervising tutors
- Download evaluation reports
- Track skill progression

---

## Conclusion
The **Internship Management System** provides a structured solution for managing internships from assignment to final evaluation. With dedicated interfaces for administrators, tutors, and interns, it meets the needs of all stakeholders. Advanced evaluation features and analytical dashboards enable precise monitoring of acquired competencies and overall internship efficiency, supporting better educational and corporate management.
