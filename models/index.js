const Student = require('./Student');
const Course = require('./Course');
const StudentCourse = require('./StudentCourse');

Student.belongsToMany(Course, {
    through: StudentCourse,
    foreignKey: 'studentId',
    otherKey: 'courseId',
    as: 'courses'
});

Course.belongsToMany(Student, {
    through: StudentCourse,
    foreignKey: 'courseId',
    otherKey: 'studentId',
    as: 'students'
});

module.exports = {
    Student,
    Course,
    StudentCourse
};
