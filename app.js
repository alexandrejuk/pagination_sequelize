const app = require('express')()
const moment = require('moment')

const Sequelize = require('sequelize');
const op = Sequelize.Op;
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  dialect:'postgres',
  operatorsAliases: false,
  port:5431,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

})

const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
});

const query = {
  firstName: 'ale',
  lastName: 'in',
  createdAt: {
    start: moment('2019-01-14T18:52:17.585Z').startOf('day'),
    end: moment('2019-01-14T18:52:17.585Z').endOf('day'),
  },
  page: {
    limit: 10,
    offset: 1,
  }
}

const userTypes = {
  firstName: 'string',
  lastName:  'string',
  createdAt: 'date'
}

const where = {}

for(const q in query){
  let campo = null
  switch (userTypes[q]) {
    case 'string':
      campo = {[op.iRegexp]: query[q] }  
      break;
    case 'date':
      campo = { [op.gte]: query[q].start, [op.lte]: query[q].end }  
      break;
    
    default:
      break;
  }

  if(campo != null) {
    where[q] = campo
  }
}

app.use('/api/users', async (req, res, next) => {
  const firstName = 'gui'
  
    const data = await User.findAndCountAll({ 
      where,
      limit: query.page.limit,
      offset: query.page.offset - 1
    })
  

  const respose = {
    total: data.count,
    data: data.rows,
    page: query.page.offset,
    limit: query.page.limit
  }

  res.json(respose)
})

app.listen(5000, () => console.log('runninng....'))