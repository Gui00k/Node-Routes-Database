const res = require('express/lib/response');
const { execute, searchUsers, searchUser, createUser } = require('./database/db')

function erro(err) {
  console.log(err)
}

function checkParameters (req, res, next) {
  const toAddress = req.query['address'];
  const valor = req.query['valor'];

  if (!req.body && (!toAddress || !valor)) {
    res.json({ "status": "failed" });
    return;
  }

  next();
}

async function checkUsers (data) {
      const [ rows, fields ] = await searchUser(data, 0).catch(erro);

      if (rows.length) {
        return 1
      }
      return 0
}

async function loadUsers (req, res) {
  let address = req.query.address
  let valor = req.query.valor || 0

  try {
    if(address || valor) {
      const [ rows, fields ] = await searchUser(address, valor).catch(erro);
      res.json(rows)
    }

    const [ rows, fields ] = await searchUsers().catch(erro);
    res.json(rows)

  } catch (error) {
    res.json({ "status": "failed", "erro": error })

  }


}

async function addUsers(req, res) {
  const dados = req.body

  try {
    if(dados.length){
      let msgAdded = 'Os seguintes registros foram cadastrados: '
      let msgNotAdded = 'Os seguintes registros não foram cadastrados: '

      for(let i=0; i < dados.length; i++){
        let ifExists = await checkUsers(dados[i].address).catch(erro)

        if (!ifExists) {
          await createUser(dados[i].address, dados[i].valor).then(() => msgAdded = msgAdded + ' ' + dados[i].address).catch(erro)

        } else {
          msgNotAdded = msgNotAdded + ' ' + dados[i].address
        }
      }
      console.log(msgAdded)
      console.log(msgNotAdded)

      res.json({ "status": "Ok", "Cadastrados": msgAdded, "Erros no cadastro": msgNotAdded})

    } else {
      let ifExists = await checkUsers(req.query['address']).catch(erro)

      !ifExists ? await createUser(req.query['address'], req.query['valor']).then(() => res.json({ "status":"Ok","Mensagem": "Cadastro realizado com sucesso" })).catch(erro)  : res.json({ "status": "failed", "Erro" : "O address informado já se encontra cadastrado!" })
    }
  } catch (error) {
    res.json({ "status": "failed", "erro": error })
  }
}

module.exports = { execute, checkParameters, loadUsers, addUsers }