const { Student, Course } = require('../models');

const isValidStudent = ({ name, email, age }) =>
    Boolean(name) &&
    Boolean(email) &&
    age !== undefined &&
    age !== null &&
    Number.isInteger(Number(age));

const handleDatabaseError = (res, error, operation) => {
    console.error(`${operation} operation failed:`, error.message);

    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            message: 'Email already exists'
        });
    }

    return res.status(500).json({
        message: `Failed to ${operation} student`
    });
};

exports.createStudent = async (req, res) => {
    const { name, email, age } = req.body;

    if (!isValidStudent({ name, email, age })) {
        return res.status(400).json({
            message: 'Name, email, and a valid integer age are required'
        });
    }

    try {
        const student = await Student.create({ name, email, age: Number(age) });
        return res.status(201).json(student);
    } catch (error) {
        return handleDatabaseError(res, error, 'insert');
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        return res.status(200).json(students);
    } catch (error) {
        return handleDatabaseError(res, error, 'retrieve');
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        return res.status(200).json(student);
    } catch (error) {
        return handleDatabaseError(res, error, 'retrieve');
    }
};

exports.getStudentCourses = async (req, res) => {
    const studentId = Number(req.params.id);

    if (!Number.isInteger(studentId) || studentId < 1) {
        return res.status(400).json({ message: 'Student ID must be a positive integer' });
    }

    try {
        const student = await Student.findByPk(studentId, {
            include: [{ model: Course, as: 'courses', through: { attributes: [] } }]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);
    } catch (error) {
        return handleDatabaseError(res, error, 'retrieve');
    }
};

exports.updateStudent = async (req, res) => {
    const { name, email, age } = req.body;

    if (!isValidStudent({ name, email, age })) {
        return res.status(400).json({
            message: 'Name, email, and a valid integer age are required'
        });
    }

    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        await student.update({ name, email, age: Number(age) });
        return res.status(200).json(student);
    } catch (error) {
        return handleDatabaseError(res, error, 'update');
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const deleted = await Student.destroy({
            where: { id: req.params.id }
        });

        if (deleted === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        return res.status(200).json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        return handleDatabaseError(res, error, 'delete');
    }
};
