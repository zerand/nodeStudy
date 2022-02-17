//main() 이랑 같은 시작점
//node_modules 는 express 설치시 따라오는것 신경쓰지 말것
const express = require('express')
const app = express()
const port = 9999

const config = require('./config/key');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

//bodyparser defined 바디파서는 클라이언트에서 입력된 정보를 서버에서 분석해서 가져올수 있도록 하는 라이브러리
//application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

//몽구스DB 연결용
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  //useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  //몽구스 6버전 이후는 디폴트 적용이라 적용하면 에러남
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! ~testcase~ !추가테스트!'))

app.get('/api/hello', (req, res) => res.send('Hello World! ~testcase~ !추가테스트! ~helloworld~'))

app.post('/api/users/register', (req, res) => {
  //회원 가입시 필요한 정보들을 client 에서 가져오면 데이터베이스에 저장시킴
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if (err) return res.json({ succsess: false, err })
    return res.status(200).json({
      succsess: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 찾음
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSucess: false,
        message: "가입된 이메일이 없습니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있다면ㄴ 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSucess: false, message: "비밀번호가 틀렸습니다." })

      //비밀번호까지 맞으면 토큰생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 저장함 쿠키, 로컬스토리지 등등 이번엔 쿠키
        res.cookie("x_auth", user.token).status(200).json({ loginSucess: true,  userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 옸다는 말은 authentication 인증이 true 라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id}, { token: "" }, (err, user) => {
    if(err) return res.json({ succsess: false, err});
    return res.status(200).send({
      succsess: true
    })
  })
})

app.listen(port, () => { console.log(`Example app listening on port ${port}`) })