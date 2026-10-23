const sequelize = require('./config/database');
const Student = require('./models/Student');

async function createTable() {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected successfully.');

        await Student.sync();
        console.log('Students table created successfully.');

        await sequelize.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exitCode = 1;
    }
}

createTable();