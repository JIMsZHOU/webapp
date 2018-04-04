/**
 * Created by MacBook Air on 2017/3/18.
 */
//左边导航栏
myapp.directive("leftNav",function(tools,$state){
    return {
        restrict:"AE",
        replace:true,
        templateUrl:"html/templates/leftSide.html",
        link:function(scope,ele,attr){
            scope.img = attr.img;
            scope.name = attr.name;
            scope.btnGroup = tools.split(attr.btn,",");
            scope.links = tools.split(attr.link,",");
            scope.btns = [];
            for(var i = 0; i < scope.btnGroup.length; i++){
                scope.btns[i] = {};
                scope.btns[i].name = scope.btnGroup[i];
                scope.btns[i].link = scope.links[i];
                scope.checked = false;
            }
            $state.go(scope.links[0]);
            scope.btns[0].checked = true;

            scope.clickFunc = function($index){
                angular.forEach(scope.btns,function(value,index){
                    if(index == $index){
                        value.checked = true;
                    }else{
                        value.checked = false;
                    }
                });
                $state.go(scope.links[$index]);
            }
        }
    }
});

// 分页
myapp.directive("navNavigation",function(tools,$state,http,$rootScope,nav){
    return {
        restrict: "AE",
        replace: true,
        scope:{
            data:"="
        },
        templateUrl: "html/templates/nav.html",
        link: function (scope, ele, attr) {
            var navLen = 5;
            var middleLen = Math.floor(navLen / 2);
            var userId =  window.sessionStorage.getItem("userId");
            scope.navValue = [1,2,3,4,5];

            var dataUrl = attr.url;
            scope.currentPage = 1;
            scope.totalPage = 1;

            scope.getDataList = function(){
                http.getData(dataUrl+ scope.currentPage,function(data){
                    scope.totalPage = data.body.totalPage;
                    for(var i = 0; i < data.body.list.length; i++){
                        if(data.body.list[i].students){
                            data.body.list[i].isShow = false;
                            data.body.list[i].score = -1;
                            for(var j = 0; j < data.body.list[i].students.length; j++){
                                if(data.body.list[i].students[j].studentId == userId){
                                    data.body.list[i].isShow = true;
                                    data.body.list[i].score = data.body.list[i].students[j].score;
                                }
                            }
                        }
                    }
                    scope.data = data.body.list;
                    getNavValue();
                });
            };

            $rootScope.refreshFunc = scope.getDataList;
            scope.getDataList();

            // 获取上一页
            scope.getPrePage = function(){
                if(scope.currentPage > 1){
                    scope.currentPage--;
                    scope.getDataList();
                }
            };
            // 获取点击页数据
            scope.getCurrentPage = function(number){
                scope.currentPage = number;
                scope.getDataList();
            };

            // 获取上一页
            scope.getNextPage = function(){
                if(scope.currentPage < scope.totalPage){
                    scope.currentPage++;
                    scope.getDataList();
                }
            };
            function getMiddleValue(min,max){
                var arr = [];
                for(var i = min; i <= max; i++){
                    arr.push(i);
                }
                return arr;
            }
            function getNavValue(){
                if(scope.totalPage == 0){
                    scope.navValue = getMiddleValue(1,1);
                }else if(scope.totalPage <= navLen){
                    scope.navValue = getMiddleValue(1,scope.totalPage);
                }else if(scope.totalPage - scope.currentPage < navLen){
                    scope.navValue = getMiddleValue(scope.totalPage - navLen + 1,scope.totalPage);
                }else if(scope.currentPage <= middleLen){
                    scope.navValue = getMiddleValue(1,navLen);
                }else{
                    scope.navValue = getMiddleValue(scope.currentPage - middleLen,scope.currentPage + middleLen);
                }
            }
        }
    }
});

// 图片提交
myapp.directive("imgUpload",function(){
    return {
        restrict:"AE",
        templateUrl:"html/templates/imgUpload.html",
        replace:true,
        scope:{
            param:"="
        },
        link:function(scope,ele,attr){
            scope.name = attr.name;
            scope.title = window.prePath + attr.title;
            ele.find("input").bind("change",function(){
                $(this).parents("form").attr("action",scope.title).attr("method","post").attr("enctype","multipart/form-data").attr("target","newWindow");
                $(this).attr("name","file");
                $(this).parents("form").submit();
                var exectuOne = false;
                window.addEventListener('message',function(event) {
                    if(exectuOne){
                        return false;
                    }
                    exectuOne = true;
                    var json = JSON.parse(event.data);
                    if(json.status == 0){
                        var imgageUrl = window.prePath + "/" + json.body;
                        $(ele).parent().css({"background":"url('" + imgageUrl +"')","background-size":"100% 100%"});
                        scope.param = imgageUrl;
                        scope.$apply();
                    }else if(json.status == 4){
                        modal.sureBox(json.msg,function(){
                            $state.go("login");
                        });
                    }else{
                        modal.hintBox(json.msg);
                    }
                },false);
            });
        }
    }
});

// 状态该表