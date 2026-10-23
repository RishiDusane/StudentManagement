const db = require('../config/db');

// Insert a student
exports.createStudent = (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined ||
        age === null || !Number.isInteger(Number(age))) {
        return res.status(400).json({
            message: 'Name, email, and a valid integer age are required'
        });
    }

    const sql = 'INSERT INTO students (name, email, age) VALUES (?, ?, ?)';

    db.query(sql, [name, email, Number(age)], (err, result) => {
        if (err) {
            console.error('Insert operation failed:', err.message);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            }

            return res.status(500).json({
                message: 'Failed to insert student'
            });
        }

        console.log('Insert operation successful. ID:', result.insertId);

        res.status(201).json({
            message: 'Student created successfully',
            id: result.insertId
        });
    });
};

// Retrieve all students
exports.getAllStudents = (req, res) => {
    const sql = 'SELECT * FROM students';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to retrieve students'
            });
        }

        res.status(200).json(results);
    });
};

// Retrieve a student by ID
exports.getStudentById = (req, res) => {
    const sql = 'SELECT * FROM students WHERE id = ?';

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to retrieve student'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.status(200).json(results[0]);
    });
};

// Update a student
exports.updateStudent = (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined ||
        age === null || !Number.isInteger(Number(age))) {
        return res.status(400).json({
            message: 'Name, email, and a valid integer age are required'
        });
    }

    const sql = `
        UPDATE students
        SET name = ?, email = ?, age = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, Number(age), req.params.id],
        (err, result) => {
            if (err) {
                console.error('Update operation failed:', err.message);

                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        message: 'Email already exists'
                    });
                }

                return res.status(500).json({
                    message: 'Failed to update student'
                });
            }

            if (result.affectedRows === 0) {
                return db.query(
                    'SELECT id FROM students WHERE id = ?',
                    [req.params.id],
                    (selectErr, rows) => {
                        if (selectErr) {
                            return res.status(500).json({
                                message: 'Failed to verify student'
                            });
                        }

                        if (rows.length === 0) {
                            return res.status(404).json({
                                message: 'Student not found'
                            });
                        }

                        console.log(
                            'Update operation: No changes required for ID:',
                            req.params.id
                        );

                        return res.status(200).json({
                            message: 'Student details are already up to date'
                        });
                    }
                );
            }

            console.log('Update operation successful. ID:', req.params.id);

            res.status(200).json({
                message: 'Student updated successfully'
            });
        }
    );
};

// Delete a student
exports.deleteStudent = (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Delete operation failed:', err.message);

            return res.status(500).json({
                message: 'Failed to delete student'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        console.log('Delete operation successful. ID:', req.params.id);

        res.status(200).json({
            message: 'Student deleted successfully'
        });
    });
};