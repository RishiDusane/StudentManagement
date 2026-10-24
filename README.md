# Student Management API

A Node.js and Express API using Sequelize and MySQL to manage students, courses, and their many-to-many enrollments. Students and courses are connected through the `StudentCourses` junction table.

## Requirements

- Node.js and npm
- MySQL Server

## Installation

Install the project dependencies:

```bash
npm install
```

The project uses the existing `.env` file for database settings. Keep that file private and set the following values if they are not already present:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sequelize_demo
DB_USER=root
DB_PASSWORD=your_mysql_password
PORT=3000
```

Do not replace an existing `.env` file or commit it. The configured schema is `sequelize_demo`; the project does not switch to another schema name.

## Database setup and start

Create the configured schema in MySQL Workbench (or run [database.sql](./database.sql)):

```sql
CREATE DATABASE IF NOT EXISTS sequelize_demo;
```

Set the connection values in `.env`, then start the API:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

At startup, the server authenticates with MySQL and calls Sequelize `sync()` without destructive options. Sequelize creates the `Students`, `Courses`, and `StudentCourses` tables when they do not exist.

## API

The API listens on `http://localhost:3000` by default. JSON request bodies should use `Content-Type: application/json`.

### Create a student

`POST /students`

```json
{
  "name": "Asha Patel",
  "email": "asha@example.com",
  "age": 20
}
```

Name, email, and integer age are required, matching the existing Student model and endpoints.

### Create a course

`POST /courses`

```json
{
  "title": "Introduction to Programming",
  "description": "Programming fundamentals"
}
```

### Enroll a student in a course

`POST /enroll`

```json
{
  "studentId": 1,
  "courseId": 1
}
```

The response includes the student and their courses. Invalid IDs return `400`; a student or course that does not exist returns `404`.

### Retrieve a student and enrolled courses

`GET /students/:id/courses`

Example: `GET /students/1/courses`

### Retrieve a course and enrolled students

`GET /courses/:id/students`

Example: `GET /courses/1/students`

The existing student endpoints remain available:

- `GET /students`
- `GET /students/:id`
- `PUT /students/:id`
- `DELETE /students/:id`

## Verify in MySQL Workbench

After starting the application and creating students, courses, and an enrollment, run:

```sql
USE sequelize_demo;
SHOW TABLES;
SELECT * FROM Students;
SELECT * FROM Courses;
SELECT * FROM StudentCourses;
```

`StudentCourses.studentId` references `Students.id`, and `StudentCourses.courseId` references `Courses.id`. Each enrollment is represented by one row linking a student to a course; the composite primary key prevents duplicate pairs.
