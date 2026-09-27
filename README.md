# EduRadar

A multi-institute academic portal built with React, Express/Node.js, and MySQL 8. The database is MySQL, as requested (rather than MongoDB in the usual MERN acronym).

## Run locally

Prerequisites: Node.js 20.19+ or 22.12+, npm, and a running MySQL 8 server.

1. Run `npm install` at the project root.
2. Copy `backend/.env.example` to `backend/.env` and enter your MySQL connection details. No real credentials are committed.
3. Run `npm run db:init` to create the database and tables. The setup account must have database/table creation privileges. Use a restricted application database account after initialization.
4. Run `npm run dev`.
5. Open http://127.0.0.1:5173. Register your institute to create its administrator account.

The **Explore the student demo** button opens an explicitly labelled, read-only preview without requiring MySQL. Real accounts and records always use MySQL; there is no automatic in-memory fallback.

## Use your institute

1. Register an institute with a unique institute code and administrator email/password.
2. Sign in as institute admin using that code, email, and password.
3. Add faculty with a faculty ID and initial password; add students with their college-issued roll number and initial password. Share credentials privately. Users can change passwords in Settings.
4. Create subjects with a semester, credit count, and assigned faculty member.
5. Select a student, choose **Update academic record**, choose a subject, and enter marks, attendance, assignments, and practical counts. Saving publishes that record immediately.
6. Faculty sign in with institute code, faculty ID, and password. They can update only assigned subjects within their institute and add extracurricular records for institute students.
7. Students sign in with institute code, roll number, and password. They can view only their own academic records. Identical roll numbers in different institutes are supported.

Students see profile, subject marks, GPA, attendance percentages, assignment/practical progress, events/certificate links, and assigned teachers. Institute admins manage accounts and subjects. Faculty can view the institute student directory, while student academic endpoints enforce personal access. Certificate uploads are not implemented; faculty can add HTTPS links.

## Grading rules

MSE is out of 30; ESE is out of 70. Grade points for total marks: 90–100 = 10 (O), 80–89.99 = 9 (A+), 70–79.99 = 8 (A), 60–69.99 = 7 (B+), 50–59.99 = 6 (B), 40–49.99 = 5 (C), below 40 = 0 (F). GPA is the credit-weighted mean of complete published subject records; missing components are excluded, not treated as zero. Cumulative GPA includes all recorded semesters. These are provisional default rules, not an institution-specific grading policy. Each subject code is unique per institute; repeat attempts and separate academic-year transcripts are not yet modeled.

## Security and deployment

- Passwords use salted scrypt hashes; session cookies are HttpOnly, SameSite=Strict, and expire after eight hours. Only hashed session tokens are stored in MySQL.
- Institute identity and roles come from the authenticated session, never request-provided tenant IDs. Composite foreign keys prevent linking academic rows across institutes.
- Writes require JSON; login and registration are rate limited. Queries are parameterized. Counts/marks are validated; academic writes include an audit row in the same transaction.
- Registration creates a new isolated institute; it does not verify college ownership. Add a domain/ownership approval process before accepting real institutional data publicly.
- Production: `npm run build`, set `NODE_ENV=production`, then `npm start`. The Express server serves the built frontend at port 4000. Place it behind HTTPS on the same origin; secure cookies require HTTPS. Configure reverse-proxy trust/rate limiting for your hosting topology, database backups, and expired-session cleanup before public operation.
- Forgotten-password recovery and bulk imports are not included. Password changes require the current password and revoke previous sessions.

## Verification

`npm test` covers password hashing, grading boundaries, input constraints, and unauthenticated API access without MySQL. `npm run build` validates the frontend production build.

`npm run test:integration` runs the real MySQL tenant-isolation workflow after database initialization. It creates uniquely named test institutes and records and retains them for inspection; run against a disposable test database. Tests cover registration, student and faculty setup, subject assignment, record publication, cross-institute reads/writes, wrong passwords, and student write denial.

## Structure

- `frontend/src/main.jsx`: React entry point; only mounts the application and loads styles.
- `frontend/src/App.jsx`: authentication state and the top-level screen.
- `frontend/src/pages/`: authentication, dashboard, academic, and institute management screens.
- `frontend/src/components/`: reusable layout, academic, dashboard, and form components.
- `frontend/src/hooks/`: dashboard state, data loading, and save handlers.
- `frontend/src/services/`: API request helper.
- `frontend/src/utils/`: grade points, percentage, and GPA calculations.
- `frontend/src/constants/`: navigation icons and default record values.
- `frontend/src/data/`: clearly labelled demo data.
- `frontend/src/styles/`: base, authentication, layout, dashboard, and responsive styles.
- `backend/`: Express API, authentication, validation, database initialization.
- `database/schema.sql`: normalized MySQL schema and tenant constraints.
- `test/`: unit/API guards and optional database integration checks.

The attached screenshots were treated as feature references. Your explicit React + Node + MySQL and institute-isolation requirements take precedence.

## Code formatting

Run `npm run format` to format source files, styles, tests, and project configuration.
Run `npm run format:check` to check formatting without changing files.
The shared Prettier configuration uses two-space indentation, single quotes, semicolons,
and a 100-character target line width. `.editorconfig` keeps editor indentation and
line endings consistent. Generated build output and dependency files are excluded.
