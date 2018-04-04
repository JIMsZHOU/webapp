/**
 * Created by MacBook Air on 2017/4/11.
 */
myapp.service("config",function(){
    var server = {};
    // 跨域中转请求的页面
    server.httpAddress = "http://121.42.8.85/static/header.html";
    server.fileAddress = "http://121.42.8.85";
    server.leftMenu = [
        "PPT管理",
        "用户管理"
    ];
    return server;
});