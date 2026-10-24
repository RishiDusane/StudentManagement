const { Course, Student } = require('../models');

const handleDatabaseError = (res, error, operation) => {
    console.error(`${operation} course operation failed:`, error.message);

    return res.status(500).json({
        message: `Failed to ${operation} course`
    });
};

exports.createCourse = async (req, res) => {
    const { title, description } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'A course title is required' });
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
        return res.status(400).json({ message: 'Description must be a string' });
    }

    try {
        const course = await Course.create({
            title: title.trim(),
            description: description || null
        });
        return res.status(201).json(course);
    } catch (error) {
        return handleDatabaseError(res, error, 'create');
    }
};

exports.getCourseStudents = async (req, res) => {
    const courseId = Number(req.params.id);

    if (!Number.isInteger(courseId) || courseId < 1) {
        return res.status(400).json({ message: 'Course ID must be a positive integer' });
    }

    try {
        const course = await Course.findByPk(courseId, {
            include: [{ model: Student, as: 'students', through: { attributes: [] } }]
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json(course);
    } catch (error) {
        return handleDatabaseError(res, error, 'retrieve');
    }
};
