const express = require('express');
const router = express.Router();

const {
    createCourse,
    getCourseStudents
} = require('../controllers/courseController');

router.post('/', createCourse);
router.get('/:id/students', getCourseStudents);

module.exports = router;
