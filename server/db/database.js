import { Sequelize } from 'sequelize';

// ✅ Assign the instance to a variable
export const sequelize = new Sequelize('yoex', 'root', 'your_secure_password', {
  host: 'localhost',
  port: 3306, // or 3307 if your XAMPP uses that
  dialect: 'mysql',
  logging: false,
});
// ✅ Test connection
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:');
  }
};

checkConnection();
