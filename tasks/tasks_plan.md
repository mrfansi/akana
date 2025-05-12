# Akana Task Management App: Tasks Plan & Project Progress

## Current Status Key

* **[TODO]** - Task is planned but not yet started.
* **[WIP]** - Task is Work In Progress.
* **[DONE]** - Task is completed.
* **[BLOCKED]** - Task is blocked by another task or issue.
* **[REVIEW]** - Task is completed and awaiting review.

## Phase 1: Project Initialization and Core Documentation (Current Phase)

* **[DONE]** Create `docs/product_requirement_docs.md`
* **[DONE]** Create `docs/architecture.md`
* **[DONE]** Create `docs/technical.md`
* **[DONE]** Create `tasks/tasks_plan.md` (This file)
* **[DONE]** Create `tasks/active_context.md`

## Phase 2: Backend Development (Laravel)

### Epic: User Management & Authentication

* **[DONE]** Verify existing authentication scaffolding (React starter kit). Current setup is sufficient.
* **[DONE]** Configure User model (add relationships for Roles, Teams, etc.) and review existing migration.
* **[DONE]** Implement Role model and migration.
* **[DONE]** Implement Team model and migration.
* **[DONE]** Implement pivot tables for user_roles, team_members.
* **[DONE]** Develop `RoleRepository` and `UserRepository`.
* **[DONE]** Develop `AuthService` for registration, login, logout.
* **[TODO]** Implement RBAC (Role-Based Access Control) middleware/policies.
  * **[TODO]** Define core permissions (e.g., `create-task`, `edit-project`, `manage-users`).
  * **[TODO]** Assign permissions to roles.
  * **[TODO]** Enforce permissions using Gates or Policies.
* **[TODO]** API endpoints for user profile management.

### Epic: Project & Task Core Structure

* **[TODO]** Implement Project model and migration.
* **[TODO]** Implement Task model and migration (including fields for status, priority, due_date, assignee_id, creator_id, parent_task_id).
* **[TODO]** Implement Comment model and migration.
* **[TODO]** Implement TaskAttachment model and migration.
* **[TODO]** Implement Notification model and migration (using Laravel's built-in notification system).
* **[TODO]** Develop `ProjectRepository` and `TaskRepository`.
* **[TODO]** Develop `ProjectService` for project CRUD operations.
* **[TODO]** Develop `TaskService` for task CRUD operations.
* **[TODO]** API endpoints for Project CRUD.
* **[TODO]** API endpoints for Task CRUD (within a project).
* **[TODO]** API endpoints for Comment CRUD on tasks.
* **[TODO]** API endpoints for TaskAttachment CRUD on tasks.

### Epic: Real-time Features with Laravel Reverb

* **[TODO]** Install and configure Laravel Reverb.
* **[TODO]** Define broadcasting events (e.g., `TaskCreated`, `TaskUpdated`, `CommentPosted`).
* **[TODO]** Implement event broadcasting in relevant services (e.g., `TaskService`, `CommentService`).
* **[TODO]** Define private and presence channels for real-time updates (e.g., `project.{id}`, `task.{id}`).
* **[TODO]** Set up Laravel Echo on the frontend to listen to Reverb channels.

### Epic: Advanced Backend Features

* **[TODO]** Implement Kanban Board, Kanban Column models and migrations.
* **[TODO]** Develop `KanbanService` for managing Kanban boards and columns.
* **[TODO]** API endpoints for Kanban board CRUD and task movement.
* **[TODO]** Implement logic for Timeline View data preparation.
* **[TODO]** Implement search functionality (e.g., using Laravel Scout with a suitable driver).
* **[TODO]** Implement notification system logic (dispatching notifications on relevant events).

## Phase 3: Frontend Development (React, Inertia.js, ShadCN UI)

### Epic: Base UI & Layout

* **[TODO]** Design and implement main application layout (`AppLayout.tsx`) using ShadCN components.
* **[TODO]** Implement authenticated user layout (`AuthenticatedLayout.tsx`).
* **[TODO]** Implement navigation (sidebar, header menu).
* **[TODO]** Implement User Profile page.
* **[TODO]** Implement Settings page.

### Epic: User Authentication (Frontend)

* **[TODO]** Implement Login page.
* **[TODO]** Implement Registration page.
* **[TODO]** Implement Forgot Password / Reset Password pages.

### Epic: Project Management (Frontend)

* **[TODO]** Implement Project List/Dashboard page.
* **[TODO]** Implement Create New Project form/modal.
* **[TODO]** Implement Project Detail page (overview, settings, members).

### Epic: Task Management (Frontend)

* **[TODO]** Implement Task List view within a project.
* **[TODO]** Implement Create New Task form/modal.
* **[TODO]** Implement Task Detail view/modal (showing description, comments, attachments).
* **[TODO]** Implement Task editing functionality.
* **[TODO]** Implement Commenting feature on tasks.
* **[TODO]** Implement File Attachment feature on tasks.

### Epic: Views & Visualizations (Frontend)

* **[TODO]** Implement Kanban Board view:
  * **[TODO]** Display columns and tasks.
  * **[TODO]** Implement drag-and-drop for tasks between columns (with real-time updates).
  * **[TODO]** Implement column creation/editing.
* **[TODO]** Implement Timeline View (Gantt-like):
  * **[TODO]** Choose and integrate a suitable charting library or build custom.
  * **[TODO]** Display tasks on a timeline.
* **[TODO]** Implement Calendar View.
* **[TODO]** Implement Role-Based Dashboards (initial versions).

### Epic: Real-time Integration (Frontend)

* **[TODO]** Configure Laravel Echo to connect to Reverb.
* **[TODO]** Implement real-time updates for task changes on relevant views (Kanban, List, Detail).
* **[TODO]** Implement real-time comment updates.
* **[TODO]** Implement in-app notifications display.

## Phase 4: Testing & Refinement

* **[TODO]** Write backend unit and feature tests for all services and repositories.
* **[TODO]** Write frontend unit and integration tests for core components and pages.
* **[TODO]** Conduct thorough integration testing between backend and frontend.
* **[TODO]** Perform User Acceptance Testing (UAT) based on user stories.
* **[TODO]** Address bugs and performance issues identified during testing.
* **[TODO]** Code review and refactoring for maintainability and SOLID principles.
* **[TODO]** Finalize documentation.

## Known Issues / Blockers

* *(None at this stage)*

This document will be updated regularly to reflect the project's progress.
