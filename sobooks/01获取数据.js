let express = require("express")
let sqlQuery = require("./xqMysql")

let app = express()

app.get('/',async (req,res)=>{
    let strSql = "select id,author,bookimg,bookname,cataory from book limit 0,28";
    let result = await sqlQuery(strSql);
    // let resJson = JSON.stringify(Array.from(result))
    // console.log(result);
    res.json(Array.from(result))
})
app.get('/xswx',async (req,res)=>{
    let strSql = "select id,author,bookimg,bookname,cataory from book where cataory = '小说文学' limit 0,28";
    let result = await sqlQuery(strSql);
    res.json(Array.from(result))
})
app.get('/books/:bookid',async (req,res)=>{
    let strSql = "select * from book where id = ?";
    let bookid = req.params.bookid;
    let result = await sqlQuery(strSql,[bookid]);
    res.json(Array.from(result))
})

module.exports = app;