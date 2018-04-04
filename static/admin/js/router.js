/**
 * Created by MacBook Air on 2017/3/18.
 */
var myapp = angular.module("myapp",['ui.router']);
window.prePath = "http://121.42.8.85/car";
myapp.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.when("","/login");
    $stateProvider
        .state("login",{
            url:"/login",
            templateUrl:"html/login.html"
        })
        .state("admin",{
            url:"/admin",
            templateUrl:"html/admin.html"
        })
        .state("admin.question",{
            url:"/question",
            templateUrl:"html/admin/question.html"
        })
        .state("admin.user",{
            url:"/user",
            templateUrl:"html/admin/user.html"
        })
});