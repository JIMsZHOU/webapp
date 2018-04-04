/**
 * Created by MacBook Air on 2017/3/17.
 */

//引入依赖
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var multiparty = require("multiparty");
var fs = require("fs");
var session = require("express-session");
var config = require("./config");
var request = require("request");

var  app = new express();
var port = 4500;

// 连接数据库
mongoose.connect("mongodb://localhost:27017/webapp");
var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",function(callback){
    console.log("db service connected");
});
// 服务器配置
app.use(express.static(path.join(__dirname,"static")));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
//setting session
app.use(session({
    secret:"308745",
    key:"blog",
    cookie:{maxAge: 1000 * 60 * 100}    // cookie十分钟过期
}));

app.listen(port);

app.use("/",function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    if(req.method == "POST"){
        res.setHeader("Access-Control-Allow-Methods","POST");
        res.setHeader("Access-Control-Allow-Headers","x-requested-with,content-type");
    }
    next();
});

// 路由管理

app.use("/question",function(req,res,next){
    var userRouter = require("./routes/question");
    userRouter(app);
    next();
});

app.use("/user",function(req,res,next){
    var articleRouter = require("./routes/user");
    articleRouter(app);
    next();
});

// 后台管理员登录
app.post("/admin/login",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    for(var i = 0; i < config.admin.length; i++){
        if(config.admin[i].username == username && config.admin[i].password == password){
            res.send(returnObj(0,"登陆成功",1));
            return;
        }
    }
});

// 返回对象
function returnObj(status,msg,data){
    var backData = {};
    backData.status = status || 0;
    backData.msg = msg || "";
    if(data){
        backData.body = data;
    }
    return backData;
}
