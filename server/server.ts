import express from 'express';
import * as mysql from 'mysql';

const app = express();

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase'
});

connection.connect(function (error: any) {
  if(!!error){
    console.log('Error');
  } else {
    console.log('connected');
  }
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    console.log(`${req.ip} ${req.method} ${req.url}`);
    next();
  }
});
app.use(express.json());

app.get('/users', (req, res) => {
  connection.query("select * from user", function (error, rows, fields) {
    if(!!error){
      console.log('Query error');
    } else {
      res.send(rows);
    }
  });
});

app.get('/messages',(req, res)=>{
  connection.query(`select * from messages`, function (error, rows, fields) {
    if(!!error){
      console.log('Query error');
    } else {
     res.send(rows);
    }
  });
});

app.get('/messageOfUser',(req, res)=>{
  connection.query(`select * from messages where user_id=${req.query.id}`, function (error,rows,fields) {
    if(!!error){
      console.log('Query error');
    } else {
      res.send(rows);
    }
  });
});

app.get('/getImage', (req, res)=>{
  connection.query(`select * from user where id=${req.query.id}`,function (error,rows,fields) {
    if(!!error){
      console.log('Query error');
    } else {
      res.send(rows);
    }
  })
})

app.post('/sendMessage',(req, res)=>{
  connection.query(`insert into messages(user_id, message, created_at) values (${req.body.id}, '${req.body.message}', current_timestamp);`,function (error,rows , fields) {
    if(!!error){
      console.log('Query Error');
    } else {
      connection.query(`select * from messages where user_id=${req.body.id}`, function (error,rows,fields) {
        if(!!error){
          console.log('Query error');
        } else {
          res.send(rows);
        }
      });
    }
  });
});

app.listen(4201, '127.0.0.1', function () {
  console.log('Server Listening on 4201');
});
