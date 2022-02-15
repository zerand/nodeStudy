//main() 이랑 같은 시작점
//node_modules 는 express 설치시 따라오는것 신경쓰지 말것
const express = require('express')
const app = express()
const port = 9999

const config = require('./config/key');

const bodyParser = require('body-parser');
const {User} = require("./models/User");

//bodyparser defined 바디파서는 클라이언트에서 입력된 정보를 서버에서 분석해서 가져올수 있도록 하는 라이브러리
//application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());

//몽구스DB 연결용
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  //useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  //몽구스 6버전 이후는 디폴트 적용이라 적용하면 에러남
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! ~testcase~ !추가테스트!'))

app.post('/register', (req, res) => {
  //회원 가입시 필요한 정보들을 client 에서 가져오면 데이터베이스에 저장시킴
  const user = new User(req.body)
  user.save((err, userInfo) =>{
    if(err) return res.json({succsess:false, err})
    return res.status(200).json({
      succsess:true
    })
  })
})

app.listen(port, () => { console.log(`Example app listening on port ${port}`)})