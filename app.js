require('dotenv').config()
const mysql = require('mysql2');

const express = require('express');
const app = express();
const { execute, checkParameters, loadUsers, addUsers } = require('./routes.js')

const pool = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  database: process.env.db_name,
  password: process.env.db_pass,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/api/teste', execute, loadUsers);
app.post('/api/teste', checkParameters, addUsers )

app.get('/api/teste', function (req, res) {
  console.log(req.query)
  const toAddress = req.query['address'];
  const valor = req.query['valor'];

  if (!toAddress || !valor) {
    res.json({ "status": "failed" });
    return;
  }

});

  /*pool.execute(
    'SELECT * FROM tb_users WHERE user_address = ? AND user_balance >= ?',
    [toAddress, valor],
    function (err, results, fields) {
     console.log(results);
      console.log(fields);
    }
  );*/

//app.listen(process.env.PORT)
app.listen(8545)
//app.listen(process.env.PORT, () => console.log(`Server running in http://localhost:${process.env.PORT}/`))
// app.listen(8545)