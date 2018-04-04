/**
 * Created by MacBook Air on 2017/3/18.
 */
// 模态框
myapp.service("modal",function(){
    var server = {};
    // 提示框
    server.hintBox = function(content){
        $(".modal-body").html(content);
        $(".btn-reset").hide();
        $('#myModal').modal('show');
        $(".btn-sure").unbind("click");
        $(".btn-sure").on("click",function(){
            $('#myModal').modal('hide');
        });
    };
    // 提示执行框
    server.sureBox = function(content,callback){
        $(".modal-body").html(content);
        $(".btn-reset").hide();
        $('#myModal').modal('show');
        $(".btn-sure").unbind("click");
        $(".btn-sure").on("click",function(){
            if(callback){
                $('#myModal').modal('hide');
                callback();
            }
        })
    };
    // 确认框
    server.sureSelect = function(content,callback){
        $(".modal-body").html(content);
        $(".btn-reset").show();
        $('#myModal').modal('show');
        $(".btn-sure").unbind("click");
        $(".btn-sure").on("click",function(){
            if(callback){
                $('#myModal').modal('hide');
                callback();
            }
        })
    };
    return server;
});

// 请求头设置
myapp.service("http",function($http,modal){
    // 请求头设置
    var server = {};
    server.getData = function(url,callback){
        $http({
            method:'get',
            url:url
        }).success(function(requestData){
            if(requestData.status == 0){
                if(callback){
                    callback(requestData);
                }
            }else if(requestData.status == 4){
                modal.hintBox(requestData.msg);
            }else{
                modal.hintBox(requestData.msg);
            }
        })
    };
    server.postData = function(url,data,callback){
        $http({
            method:'post',
            url:url,
            dataType:"json",
            data:JSON.stringify(data),
            contentType:"application/json"
        }).success(function(requestData){
            if(requestData.status == 0){
                if(callback){
                    callback(requestData);
                }
            }else if(requestData.status == 4){
                modal.hintBox(requestData.msg);
            }else{
                modal.hintBox(requestData.msg);
            }
        })
    };

    return server;

});

// 工具函数
myapp.service("tools",function(){
    var server = {};
    server.split = function(str,sign){
        var arr = [];
        if(String(str).indexOf(sign) >= 0){
            arr = str.split(sign);
        }else{
            arr[0] = str;
        }
        return arr;

    };
    return server;
});

// 保存分页当前页
myapp.service("nav",function(){
    var server = {};
    server.currentPage = 1;

    return server;
});

// 分割字符串
myapp.filter('cutStr',function(){
    return function(str,sign){
        var arr = [];
        if(str.indexOf(sign) >= 0){
            arr = str.split(sign);
            for(var i = arr.length - 1; i >= 0; i--){
                if(!arr[i]){
                    arr.splice(i,1);
                }
            }
        }else{
            arr[0] = str;
        }
        return arr;
    }
});

myapp.filter("to_trusted",function($sce){
    return function(str){
        return $sce.trustAsHtml(str);
    }
});

myapp.filter("status",function($sce){
    var statusType = {
        questionStatus : {
            0:"判断题",
            1:"选择题"
        },
        answerStatus : {
            0:"A",
            1:"B",
            2:"C",
            3:"D"
        },
        gardeStatus : {
            1:"本科大一",
            2:"本科大二",
            3:"本科大三",
            4:"本科大四"
        }
    };
    return function(str,type){
        if(parseInt(str) == str){
            return statusType[type][str];
        }
    }
});

myapp.filter("classTime",function(){
    return function(time){
        var weekDesc = ["","周日","周一","周二","周三","周四","周五","周六"];
        var dayDesc = ["上午1,2节","上午3,4节","下午5,6节","下午7,8","晚上9,10节"]
        var str = "";
        if(!time){
            return false;
        }
        for(var i = 0; i < time.length; i++){
            if(str){
                str += '；'+  weekDesc[time[i].week] + " " + dayDesc[time[i].day];
            }else{
                str = weekDesc[time[i].week] + " " + dayDesc[time[i].day];
            }
        }
        return str;
    }
});