const express = require('express');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');

const app = express();

app.use(express.json());

app.use('/students', studentRoutes);

app.get('/', (req, res) => {
    res.send('Student Management API is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});