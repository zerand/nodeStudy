//main() 이랑 같은 시작점
//node_modules 는 express 설치시 따라오는것 신경쓰지 말것
const express = require('express')
const app = express()
const port = 9999

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://zerand:5123658@cluster0.h6jut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  //useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  //몽구스 6버전 이후는 디폴트 적용이라 적용하면 에러남
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! ~testcase~')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})