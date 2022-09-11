import mysql from 'mysql2';

import config from './../config.js';

const connection = mysql.createConnection({
  host: config.HOST,
  user: config.DBUSER,
  password: config.DBPASSWD,
  database: config.DBNAME,
});

connection.connect((error) => {
  if (error) {
    return console.log('Ошибка подключения к БД');
  } else {
    return console.log('Подключение к БД успешно');
  }
});

export default connection;
