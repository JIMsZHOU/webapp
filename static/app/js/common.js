/**
 * Created by MacBook Air on 2017/5/2.
 */

// 跨域请求
var httpAddress = "http://121.42.8.85/static/header.html";
window.prePath = "http://121.42.8.85/car";
window.picAddr = "http://121.42.8.85";
var http = {
    init:function(callback){
        if($("#form-iframe").length > 0){
            $("#form-iframe").on("load",function(){
                if(callback){
                    callback();
                }
            });
        }else{
            var str = '<iframe id="form-iframe" name="form-iframe" src="'+ httpAddress +'" style="display: none;"></iframe>';
            $("body").append(str);
            $("#form-iframe").on("load",function(){
                if(callback){
                    callback();
                }
            });
        }
    },
    dataDeal:function(requestUrl,callback){
        var onceDataOrigin = "";
        window.addEventListener('message',function(event) {
            var param = JSON.parse(event.data);
            var data = param.data;
            if(param.origin != requestUrl || onceDataOrigin == param.origin){
                return false;
            }
            onceDataOrigin = requestUrl;
            if(data.status == 0){
                if(callback){
                    callback(data);
                }
            }else if(data.status == 4){
                modal.sureBox(data.msg,function(){
                    $state.go("login");
                });
            }else{
                modal.hintBox(data.message);
            }
        },false);
    },
    getData : function(url,callback){
        var _self = this;
        this.init(function(){
            var param = {
                method:"get",
                url: window.prePath + url
            };
            window.frames[0].postMessage(JSON.stringify(param),httpAddress);
            _self.dataDeal(window.prePath + url,callback);
        });
    },
    postData : function(url,data,callback){
        var _self = this;
        this.init(function(){
            var param = {
                method:"post",
                url:window.prePath + url,
                data:data
            };
            $("#form-iframe")[0].contentWindow.postMessage(JSON.stringify(param),httpAddress);
            _self.dataDeal(window.prePath + url,callback);
        });
    }
};