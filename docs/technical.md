# Akana Task Management App: Technical Documentation

## 1. Development Environment Setup

To contribute to the Akana project, you will need the following installed on your system:

* **PHP:** Version 8.2 or newer (check Laravel's current requirements).
  * Required PHP Extensions: Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, XML, JSON.
* **Composer:** Latest stable version (for PHP dependency management).
* **Node.js:** Latest LTS version (e.g., 20.x or newer).
* **NPM or Yarn:** For JavaScript package management (NPM usually comes with Node.js).
* **Database Server:**
  * MySQL: Version 8.0 or newer.
  * Or PostgreSQL: Version 13 or newer.
* **Web Server:**
  * Nginx (recommended for production) or Apache.
  * Ensure it's configured to serve Laravel applications (public directory as root, URL rewriting).
* **Git:** For version control.
* **(Optional) Docker & Docker Compose:** For a containerized development environment. A `docker-compose.yml` file may be provided in the future.
* **(Optional) Redis or Memcached:** If caching beyond file/database is required for performance.

**Initial Setup Steps:**

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd akana`
3. Install PHP dependencies: `composer install`
4. Install JavaScript dependencies: `npm install` (or `yarn install`)
5. Create a `.env` file from `.env.example`: `cp .env.example .env`
6. Generate an application key: `php artisan key:generate`
7. Configure your `.env` file with database credentials, app URL, and other necessary settings (e.g., mail driver, Reverb settings).
8. Run database migrations: `php artisan migrate`
9. (Optional) Seed the database: `php artisan db:seed`
10. Compile frontend assets: `npm run dev` (for development) or `npm run build` (for production).
11. Start the development server (if not using a dedicated web server like Valet or Laragon): `php artisan serve`
12. Start Laravel Reverb: `php artisan reverb:start` (ensure Reverb is installed and configured via `php artisan install:broadcasting`).

## 2. Laravel Setup

* **Laravel Version:** Latest stable (e.g., Laravel 11 or newer).
* **Key Packages (to be installed/configured):**
  * `laravel/breeze` or `laravel/jetstream` (with Inertia stack) for authentication scaffolding.
  * `inertiajs/inertia-laravel` (usually included with Breeze/Jetstream Inertia stack).
  * `laravel/reverb` for WebSocket broadcasting.
  * `laravel/sanctum` (if API authentication is needed separately, often included).
* **Broadcasting:**
  * Driver: `reverb`
  * Ensure `BROADCAST_CONNECTION=reverb` in `.env`.
  * Reverb app ID, key, secret, host, and port to be configured in `.env`.
* **Queue:**
  * Consider using a database, Redis, or SQS for queue workers for background jobs (e.g., sending notifications). `QUEUE_CONNECTION` in `.env`.
* **Mail:** Configure mail driver (e.g., SMTP, Mailgun, SES) in `.env` for email notifications.

## 3. React & Inertia.js Setup

* **Project Structure (`resources/js/`):**
  * `Pages/`: Inertia page components (e.g., `Dashboard.tsx`, `Projects/Index.tsx`, `Tasks/Show.tsx`).
  * `Components/`: Reusable React components (e.g., `Button.tsx`, `Modal.tsx`, `TaskCard.tsx`).
    * `Layouts/`: Main application layouts (e.g., `AppLayout.tsx`, `AuthenticatedLayout.tsx`).
    * `Shared/`: Components shared across multiple pages but not global layouts.
  * `Hooks/`: Custom React hooks.
  * `Lib/` or `Utils/`: Utility functions, helper classes.
  * `Types/`: TypeScript type definitions.
  * `app.tsx`: Main Inertia app setup.
  * `ssr.tsx`: Server-side rendering entry point (if used).
* **Routing:** Handled by Laravel, with Inertia rendering the appropriate React page component.
* **State Management:**
  * For simple local state: React's `useState` and `useReducer`.
  * For global state or complex shared state: React Context API. Consider Zustand or Jotai for more complex scenarios if Context API becomes unwieldy.
  * Inertia's shared data for props passed from Laravel to all pages.
* **TypeScript:** The project will use TypeScript for improved type safety and developer experience.

## 4. ShadCN UI Integration

* **Initialization:** ShadCN UI is assumed to be already initialized (`npx shadcn-ui@latest init`).
* **Component Usage:** Components will be added as needed using `npx shadcn-ui@latest add <component-name>`.
* **Theming:** Customize `tailwind.config.js` and `resources/css/app.css` (or `globals.css` if used by ShadCN) to match the desired application theme and branding.
* **Responsiveness:** Utilize Tailwind CSS utility classes and ShadCN's responsive component variants to ensure the UI adapts well to different screen sizes.

## 5. Coding Standards

* **PHP (Backend):**
  * PSR-12: Extended Coding Style.
  * Use PHPStan or Psalm for static analysis to catch errors and ensure code quality.
  * Laravel Pint can be used for automatic code formatting.
* **TypeScript/JavaScript (Frontend):**
  * ESLint: For code linting. Configuration will be in `eslint.config.js`.
  * Prettier: For code formatting. Configuration in `.prettierrc` and `.prettierignore`.
  * Follow standard React best practices (e.g., component composition, hook usage).
* **General:**
  * Write clear, concise, and well-documented code.
  * Use meaningful variable and function names.
  * Keep functions and methods short and focused (Single Responsibility Principle).

## 6. Version Control Strategy

* **Git:** All code will be managed using Git.
* **Branching Model:**
  * `main` (or `master`): Represents the production-ready code.
  * `develop`: Integration branch for features. All feature branches are merged into `develop`.
  * `feature/<feature-name>`: For developing new features (e.g., `feature/task-kanban-board`). Branched from `develop`.
  * `bugfix/<issue-id>`: For fixing bugs. Branched from `develop` or `main` (for hotfixes).
  * `hotfix/<issue-id>`: For critical production bugs. Branched from `main` and merged back into both `main` and `develop`.
* **Commit Messages:** Follow Conventional Commits format (e.g., `feat: add user login functionality`, `fix: resolve task assignment bug #123`).
* **Pull Requests (PRs):**
  * All changes to `develop` and `main` must go through PRs.
  * PRs should be reviewed by at least one other team member.
  * Automated checks (linters, tests) should pass before merging.

## 7. Testing Strategy

* **Backend (PHP - PHPUnit/Pest):**
  * **Unit Tests:** Test individual classes and methods in isolation (e.g., Repositories, specific Service methods, Models).
  * **Feature Tests (Integration Tests):** Test application features from an HTTP request perspective, covering controller actions, service interactions, and database state (e.g., creating a task via an API endpoint).
  * Aim for high test coverage, especially for critical business logic.
* **Frontend (TypeScript/React - Jest, React Testing Library):**
  * **Unit Tests:** Test individual React components and utility functions in isolation.
  * **Integration Tests:** Test interactions between multiple components.
  * Focus on testing user interactions and component behavior rather than implementation details.
* **End-to-End (E2E) Tests (Optional, using tools like Cypress or Playwright):**
  * Test complete user flows through the browser. Can be implemented for critical paths.
* **CI/CD Pipeline:** Tests should be automatically run in a CI/CD pipeline (e.g., GitHub Actions, GitLab CI) on every push and PR.

This document provides the technical guidelines for the Akana project. It will be updated as needed throughout the development lifecycle.
