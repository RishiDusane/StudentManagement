const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentCourse = sequelize.define('StudentCourse', {
    studentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'StudentCourses',
    timestamps: false
});

module.exports = StudentCourse;
