import * as dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

// MySQL connection
const db = process.env.DB_DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const sequelize = new Sequelize(db, username, password, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // please change this if you use postgreSQL or other RDBMS 
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

sequelize.sync({ force: false })  // { force: false } ensures the table is only created if it doesn't exist
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating tables:', err);
  });

export default sequelize;