require('dotenv').config()
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')

let tokenAddress = '0x98781815b0c3a8d634fc050bf02d36626063d399' // WAIFU contract address
let toAddress = '0x0924e75ccB1F863ca5B0DEF2a6A4A98b48998D8F' // where to send it
let fromAddress = '0xBC8ee9baC45d9075F99558e1e6E1898c07fa9C54' // your wallet
let privateKey = Buffer.from (process.env.wallet_pass, 'hex')


const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  database: process.env.db_name,
  password: process.env.db_pass,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool .execute(
  'SELECT * FROM table WHERE name = ? AND age > ?',
  ['Rick C-137', 53],
  function(err, results, fields) {
    console.log(results); 
    console.log(fields); 
  }
);


const Web3js = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))



let contractABI = [
  // transfer
  {
    'constant': false,
    'inputs': [
      {
        'name': '_to',
        'type': 'address'
      },
      {
        'name': '_value',
        'type': 'uint256'
      }
    ],
    'name': 'transfer',
    'outputs': [
      {
        'name': '',
        'type': 'bool'
      }
    ],
    'type': 'function'
  }
]

let contract = new Web3js.eth.Contract(contractABI, tokenAddress, {from: fromAddress})

// 1e18 === 1 HST
let amount = Web3js.utils.toHex(5e18)

Web3js.eth.getTransactionCount(fromAddress)
  .then((count) => {
    let rawTransaction = {
      'from': fromAddress,
      'gasPrice': Web3js.utils.toHex(20 * 1e9),
      'gasLimit': Web3js.utils.toHex(210000),
      'to': tokenAddress,
      'value': 0x0,
      'data': contract.methods.transfer(toAddress, amount).encodeABI(),
      'nonce': Web3js.utils.toHex(count)
    }
    let transaction = new Tx(rawTransaction)
    transaction.sign(privateKey)
    Web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
      .on('transactionHash', console.log)
  })