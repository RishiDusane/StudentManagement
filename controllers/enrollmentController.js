const { Student, Course } = require('../models');

exports.enrollStudent = async (req, res) => {
    const studentId = Number(req.body.studentId);
    const courseId = Number(req.body.courseId);

    if (!Number.isInteger(studentId) || studentId < 1 ||
        !Number.isInteger(courseId) || courseId < 1) {
        return res.status(400).json({
            message: 'Positive integer studentId and courseId values are required'
        });
    }

    try {
        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await student.addCourse(course);

        const enrolledStudent = await Student.findByPk(studentId, {
            include: [{ model: Course, as: 'courses', through: { attributes: [] } }]
        });

        return res.status(201).json(enrolledStudent);
    } catch (error) {
        console.error('Student enrollment failed:', error.message);
        return res.status(500).json({ message: 'Failed to enroll student in course' });
    }
};
