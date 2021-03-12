var createError = require('http-errors');
var express = require('express');
var path = require('path');
var sqlQuery = require('./xqMysql')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));



app.get('/',async (req,res)=>{
  // let strSql = "select id,bookname,bookimg,author,cataory from book limit 0,28";
  // let result = await sqlQuery(strSql)
  
  let pageid = 1
  let sqlStr = "select id,bookname,bookimg,author,cataory from book limit ?,28"
  let arr = [(pageid-1)*28];
  let result = await sqlQuery(sqlStr,arr)

  //获取总页数
  let sqlStr1 = "select count(id) as num  from book"
  let result1 = await sqlQuery(sqlStr1)
  let allPage = Math.ceil(result1[0].num/28) ;
  let cataoryId = 1
  //设置分页的起始点
  let startPage = (pageid - 4)<1?1:(pageid-4);
  let endPage = (pageid+5)>allPage?allPage:pageid+5;

  let options = {
    books:Array.from(result),
    cataorys:await getCataory(),
    allPage,
    pageid,
    cataoryId,
    startPage,
    endPage
  }
  res.render("bookindex.ejs",options)
})

// app.get('/cataorys/:cataoryId',async (req,res)=>{
//   let strSql = "select id,bookname,bookimg,author,cataory from book where cataory in (select cataory from cataory where id =?) limit 0,28"
//   let cataoryId= req.params.cataoryId
//   let result = await sqlQuery(strSql,[cataoryId])
//   let options = {
//     books:Array.from(result),
//     cataorys:await getCataory()
//   }
//   res.render("bookindex.ejs",options)
// })

app.get('/cataorys/:cataoryId/page/:pageid',async (req,res)=>{
  let pageid = parseInt(req.params.pageid)
  let cataoryId= req.params.cataoryId
  let strSql = "select id,bookname,bookimg,author,cataory from book where cataory in (select cataory from cataory where id =?) limit ?,28"
  let arr = [req.params.cataoryId,(pageid-1)*28]
  let result = await sqlQuery(strSql,arr)


  let strSql1 = "select count(id) as num from book where cataory in (select cataory from cataory where id =?)"
  let result1 = await sqlQuery(strSql1,[cataoryId])
  let allPage = Math.ceil(result1[0].num/28)  
  let startPage = (pageid - 4)<1?1:(pageid-4);
  let endPage = (pageid+5)>allPage?allPage:pageid+5;

  let options = {
    books:Array.from(result),
    cataorys:await getCataory(),
    allPage,
    pageid,
    cataoryId,
    startPage,
    endPage
  }

  res.render("bookList.ejs",options)
})

app.get('/books/:bookid',async (req,res)=>{
  let strSql = "select * from book where id = ?";
  let bookid = req.params.bookid
  let result = await sqlQuery(strSql,[bookid])
  let options = {
    book:result[0],
    cataorys:await getCataory()
  }
  // console.log(result)
  // res.send(bookid)
  res.render('bookinfo.ejs',options)
})

app.get('/search/:searchKey/page/:pageid',async (req,res)=>{
  let strSql = "select id,bookname,bookimg,author,cataory from book where bookname like '%"+req.params.searchKey+"%' or author like '%"+req.params.searchKey+"%' limit 0,28"
  let result = await sqlQuery(strSql)

  //获取总页数
  let sqlStr1 = "select count(id) as num  from book where bookname  like '%"+req.params.searchKey+"%' or author like '%"+req.params.searchKey+"%'"
  let result1 = await sqlQuery(sqlStr1)
  let allPage = Math.ceil(result1[0].num/28) ;
  let searchKey = req.params.searchKey
  //设置分页的起始点
  let pageid = parseInt(req.params.pageid)
  let startPage = (pageid - 4)<1?1:(pageid-4);
  let endPage = (pageid+5)>allPage?allPage:pageid+5;
  let options = {
    books:Array.from(result),
    cataorys:await getCataory(),
    allPage,
    pageid,
    searchKey,
    startPage,
    endPage
  }
  res.render("searchindex.ejs",options)
})

async function getCataory(){
  let strSql = "select * from cataory"
  let result = await sqlQuery(strSql)
  return Array.from(result)
}

module.exports = app;
