const mysql = require('mysql2');
const pool =  mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function erro(err) {
  console.log(err)
}

const db = pool.promise();

async function execute(req, res, next) {
  await db.execute(`
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}
  `).catch(erro)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tb_users (
      id INT PRIMARY KEY AUTO_INCREMENT, 
      user_address CHAR(50), 
      user_balance INT)
  `).catch(erro)

  next()
} 

async function searchUsers() {
  const sql = `
      SELECT * FROM tb_users
  `;

  const [ rows, fields ] = await db.query(sql).catch(erro);

  return [ rows, fields ];
}

async function searchUser(address, valor) {
  const sql = `
      SELECT * FROM tb_users
      WHERE user_address = ? AND user_balance >= ?
  `;

  const [ rows, fields ] = await db.query(sql, [address, valor]).catch(erro);
  return [ rows, fields ];
}

async function createUser(address, valor) {
  const sql = `
    INSERT INTO tb_users (user_address, user_balance)
    VALUES (?, ?)
  `

  await db.execute(sql, [address, valor]).catch(erro)
}

module.exports = { execute, searchUsers, searchUser, createUser }