const express = require('express');

const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const app = express();

app.use(express.json());

app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/enroll', enrollmentRoutes);

app.get('/', (req, res) => {
    res.send('Student Management API is running');
});

module.exports = app;
