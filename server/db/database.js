import { Sequelize } from 'sequelize';


// Option 3: Passing parameters separately (other dialects)
 export const sequelize = new Sequelize('yoyo', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle',
 port: 3306, // 3306
});




// // Test the connection
// const checkConnection = async () => {
//   try {
//     await sequelize.authenticate(); // This tries to connect to the DB
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// checkConnection();