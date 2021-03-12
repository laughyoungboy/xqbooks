let express = require("express")
let sqlQuery = require("./xqMysql")

let app = express()
//使用模板来渲染页面
let ejs = require("ejs")
app.set('views',"views"); //设置视图的对应目录
app.set('view engine',"ejs");//设置默认的模板引擎
app.set('ejs',ejs.__express);//定义模板引擎

app.get('/',(req,res)=>{
    //插入变量
    let options = {
        title:"XqSobooks首页",
        articleTitle:"<h1>文章标题</h1>"
    }
    res.render("index.ejs",options)
})
app.get('/tj',(req,res)=>{
    //条件
    let options = {
        usename:"小明",
        sex:"男"
    }
    res.render("condition.ejs",options)
})
app.get('/xh',(req,res)=>{
    //循环
    let stars = ["胡歌","许嵩","唐嫣","刘亦菲"]
    let options = {
        stars
    }
    res.render("xh.ejs",options)
})

module.exports = app;