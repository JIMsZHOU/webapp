/**
 * Created by MacBook Air on 2017/5/17.
 */
var multiparty = require("multiparty");
var fs = require("fs");
var config = require("../config");
var Question = require("../models/question");

module.exports = function(app){
    // 获取题目列表(分页)
    app.get("/question/list",function(req,res){
        var currentPage = req.query.currentPage;
        var pageSize = config.pageSize;
        Question.find({},null,{sort:{'create':-1}},function(err,results){
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
    // 添加题目
    app.post("/question/add",function(req,res){
        var question = new Question({
            type:req.body.type,
            content:req.body.content,
            options:req.body.options,
            answer:req.body.answer,
            detail:req.body.detail,
            score:req.body.score,
            degree:req.body.degree,
            keyword:req.body.keyword,
            create : Date.now()
        });
        question.save(function(err,results){
            if(err){
                console.log(err);
            }else{
                res.send(returnObj(0,"添加成功"));
            }
        });
    });
    // 修改题目
    app.post("/question/update",function(req,res){
        var id = req.body._id;
            var newQuestion = {
                type:req.body.type,
                content:req.body.content,
                options:req.body.options,
                answer:req.body.answer,
                detail:req.body.detail,
                keyword:req.body.keyword,
                score:req.body.score,
                degree:req.body.degree
            };
            Question.update({_id:id},{$set:newQuestion},function(err,result){
                if(err){
                    console.log(err);
                }else{
                    if(result.nModified > 0){
                        res.send(returnObj(0,"修改成功"))
                    }
                }
            });
    });
    // 删除题目
    app.get("/question/delete",function(req,res){
        var id = req.query.id;
        Question.remove({_id:id},function(err,results){
            if(err){
                console.log(err);
            }else{
                if(results.result.n > 0){
                    res.send(returnObj(0,"删除成功"));
                }
            }
        });
    });
    // 搜索题目(type:0 内容 type:1 知识点)
    app.get("/question/search",function(req,res){
        var keyword = req.query.keyword;
        var type = req.query.type;
        if(!keyword){
            res.send(returnObj(0,"查询失败",[]));
            return false;
        }
        var regex = new RegExp('\w*'+keyword+'\w*');
        if(type == 0){
            Question.find({content:{$regex:regex}},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"查询成功",results));
                }
            });
        }
        if(type == 1){
            Question.find({keyword:{$regex:regex}},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    res.send(returnObj(0,"查询成功",results));
                }
            });
        }

    });

    // 排题
    app.get("/question/test",function(req,res){
        Question.find({},function(err,results){
            if(err){
                console.log(err);
            }else{
                res.send(returnObj(0,"查询成功",results));
            }
        });
    });

    // 遗传算法
    app.get("/question/list",function(){
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