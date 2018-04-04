/**
 * Created by MacBook Air on 2017/5/17.
 */
var multiparty = require("multiparty");
var fs = require("fs");
var config = require("../config");
var User = require("../models/user");

module.exports = function(app){
    // 学生登录
    app.post("/user/login",function(req,res){
        User.find({num:req.body.username,password:req.body.password},function(err,results){
            if(err){
                console.log(err);
            }else{
                if(results.length > 0){
                    req.session.userId = results[0]._id;
                    res.send(returnObj(0,"登录成功"));
                }
            }
        });
    });

    // 获取学生列表(分页)
    app.get("/user/list",function(req,res){
        var currentPage = req.query.currentPage;
        var pageSize = config.pageSize;
        User.find({},null,{sort:{'create':-1}},function(err,results){
            if(err){
                console.log(err);
            }else{
                if(currentPage <= 1){
                    currentPage = 1;
                }
                var data = [];
                for(var i = (currentPage -1) * pageSize; i < currentPage * pageSize && i < results.length; i++){
                    data.push(results[i]);
                }
                var body = {
                    currentPage:currentPage,
                    totalPage:Math.ceil(results.length / pageSize),
                    list:data
                };
                res.send(returnObj(0,"查询成功",body));
            }
        });
    });
    // 添加学生
    app.post("/user/add",function(req,res){
        var user = new User({
            num : req.body.num,
            name : req.body.name,
            password : req.body.password,
            school:req.body.school,
            major:req.body.major,
            create : Date.now()
        });
        user.save(function(err,results){
            if(err){
                console.log(err);
            }else{
                res.send(returnObj(0,"添加成功"));
            }
        });
    });
    // 修改学生
    app.post("/user/update",function(req,res){
        var id = req.body._id;
        var newUser = {
            num : req.body.num,
            name : req.body.name,
            password : req.body.password,
            school:req.body.school,
            major:req.body.major
        };
        User.update({_id:id},{$set:newUser},function(err,result){
            if(err){
                console.log(err);
            }else{
                if(result.nModified > 0){
                    res.send(returnObj(0,"修改成功"))
                }
            }
        });
    });
    // 删除学生
    app.get("/user/delete",function(req,res){
        var id = req.query.id;
        User.remove({_id:id},function(err,results){
            if(err){
                console.log(err);
            }else{
                if(results.result.n > 0){
                    res.send(returnObj(0,"删除成功"));
                }
            }
        });
    });
    // 搜索学生(type:0 名字 type:1 学号)
    app.get("/user/search",function(req,res){
        var keyword = req.query.keyword;
        var type = req.query.type;
        if(!keyword){
            res.send(returnObj(0,"查询失败",[]));
            return false;
        }
        var regex = new RegExp('\w*'+keyword+'\w*');
        if(type == 0){
            User.find({name:{$regex:regex}},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"查询成功",results));
                }
            });
        }
        if(type == 1){
            User.find({num:{$regex:regex}},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"查询成功",results));
                }
            });
        }

    });

    // 获取session
    app.get("/user/sessionUser",function(req,res){
        var id = req.session.userId;
        if(!id){
            res.send(returnObj(1,"用户未登陆"));
            return false;
        }
        User.find({_id:id},function(err,results){
            if(err){
                console.log(err);
            }else{
                res.send(returnObj(0,"查询成功",results[0]));
            }
        });
    });

    // 退出
    app.get("/user/logout",function(req,res){
        req.session.userId = null;
        res.send(returnObj(0,"退出成功"));
    });
};

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