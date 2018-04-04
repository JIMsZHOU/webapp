/**
 * Created by MacBook Air on 2017/3/18.
 */

// 登录
myapp.controller("login",function($scope,http,modal,$state,tools,$rootScope){
    $scope.submitData = {};
    $scope.submitData.role = 0;
    $scope.submit = function(){
        if(!$scope.submitData.username || !$scope.submitData.password){
            modal.hintBox("输入框不能为空");
            return false;
        }
        http.postData("/admin/login",$scope.submitData,function(data){
            window.sessionStorage.setItem("userId",data.body._id);
            $rootScope.userId = data.body._id;
            $state.go("admin");
        });
    }
});

// 后台管理
myapp.controller("admin",function($scope,$state,config,tools){
    $scope.leftMenu = "";
    $scope.address = "";
    $scope.userName = "";
    var roleArr = {
        admin:{
            menu:"题目列表,用户管理",
            url:"admin.question,admin.user"
        }
    };
    $scope.leftMenu = roleArr.admin.menu;
    $scope.address = roleArr.admin.url;
    $scope.userName = "管理员";
});

// 题目管理
myapp.controller("question",function($scope,$state,http,modal,$rootScope){
    $scope.CarList = [];
    $scope.modifyData = {};
    $scope.isModified = false;
    $scope.detail = {};

    $scope.data = [
        {
            name:"题目列表",
            checked:true
        },
        {
            name:"题目添加",
            checked:false
        },
        {
            name:"题目详情",
            checked:false
        }
    ];

    // 导航
    $scope.clickFunc = function($index){
        switch (parseInt($index)){
            case 0:
                $scope.data[0].checked = true;
                $scope.data[1].checked = false;
                $scope.data[2].checked = false;
                break;
            case 1:
                $scope.data[0].checked = false;
                $scope.data[1].checked = true;
                $scope.data[2].checked = false;
                break;
        }
        $scope.modifyData = {};
        $scope.isModified = false;
        $scope.detail = {};
    };

    // 添加学生
    $scope.addStudent = function(){
        if($scope.isModified){
            http.postData("/question/update",$scope.modifyData,function(data){
                modal.hintBox(data.msg);
                $rootScope.refreshFunc();
            });
        }else{
            http.postData("/question/add",$scope.modifyData,function(data){
                modal.hintBox(data.msg);
                $rootScope.refreshFunc();
                $scope.modifyData = {};
            });
        }
    };

    // 删除
    $scope.delete = function(id){
        modal.sureSelect("确认删除该项？",function(){
            http.getData("/question/delete?id="+id,function(data){
                $rootScope.refreshFunc();
            });
        });
    };
    // 修改内容
    $scope.modify = function(car){
        $scope.modifyData = car;
        $scope.isModified = true;
        $scope.data[0].checked = false;
        $scope.data[1].checked = true;
        $scope.data[2].checked = false;
    };

    // 详情
    $scope.lookOver = function(car){
        $scope.detail = car;
        $scope.data[0].checked = false;
        $scope.data[1].checked = false;
        $scope.data[2].checked = true;
    };

    // 搜索
    var searchType = 0;
    $(".search-class .dropdown-menu li").click(function(){
        var index = $(".search-class .dropdown-menu li").index(this);
        searchType = index;
        var text = $(this).find("a").html();
        var hintText = ["按题目内容搜索","按题目知识点搜索"];
        var str = text + ' <span class="caret"></span>';
        $(".search-class button").html(str);
        $(".search-class input").attr("placeholder",hintText[index]);
    });
    // 搜索内容
    $(".search-keyword").on("keyup",function(){
        var keyword = $(this).val();
        if(keyword.length > 0){
            searchClass(keyword,searchType);
        }else{
            $rootScope.refreshFunc();
        }
    });

    // 搜索课程
    function searchClass(keyword,type){
        http.getData("/question/search?type="+ type + "&keyword=" + keyword,function(data){
            if(data.status == 0){
                $scope.CarList = data.body;
            }
        });
    }
});

// 学生管理
myapp.controller("user",function($scope,$state,http,modal,$rootScope){
    $scope.CarList = [];
    $scope.modifyData = {};
    $scope.isModified = false;
    $scope.detail = {};

    $scope.data = [
        {
            name:"用户列表",
            checked:true
        },
        {
            name:"用户添加",
            checked:false
        },
        {
            name:"用户详情",
            checked:false
        }
    ];

    // 导航
    $scope.clickFunc = function($index){
        switch (parseInt($index)){
            case 0:
                $scope.data[0].checked = true;
                $scope.data[1].checked = false;
                $scope.data[2].checked = false;
                break;
            case 1:
                $scope.data[0].checked = false;
                $scope.data[1].checked = true;
                $scope.data[2].checked = false;
                break;
        }
        $scope.modifyData = {};
        $scope.isModified = false;
        $scope.detail = {};
    };

    // 添加学生
    $scope.addStudent = function(){
        if($scope.isModified){
            http.postData("/user/update",$scope.modifyData,function(data){
                $scope.data[0].checked = false;
                $scope.data[1].checked = true;
                modal.hintBox(data.msg);
                $rootScope.refreshFunc();
            });
        }else{
            http.postData("/user/add",$scope.modifyData,function(data){
                $scope.data[0].checked = false;
                $scope.data[1].checked = true;
                modal.hintBox(data.msg);
                $rootScope.refreshFunc();
            });
        }
    };

    // 删除
    $scope.delete = function(id){
        modal.sureSelect("确认删除该项？",function(){
            http.getData("/user/delete?id="+id,function(data){
                $rootScope.refreshFunc();
            });
        });
    };
    // 修改内容
    $scope.modify = function(car){
        $scope.modifyData = car;
        $scope.isModified = true;
        $scope.data[0].checked = false;
        $scope.data[1].checked = true;
        $scope.data[2].checked = false;
    };

    // 详情
    $scope.lookOver = function(car){
        $scope.detail = car;
        $scope.data[0].checked = false;
        $scope.data[1].checked = false;
        $scope.data[2].checked = true;
    };

    // 搜索
    var searchType = 0;
    $(".search-class .dropdown-menu li").click(function(){
        var index = $(".search-class .dropdown-menu li").index(this);
        searchType = index;
        var text = $(this).find("a").html();
        var hintText = ["按教师名字搜索","按教师工号搜索"];
        var str = text + ' <span class="caret"></span>';
        $(".search-class button").html(str);
        $(".search-class input").attr("placeholder",hintText[index]);
    });
    // 搜索内容
    $(".search-keyword").on("keyup",function(){
        var keyword = $(this).val();
        if(keyword.length > 0){
            searchClass(keyword,searchType);
        }else{
            $rootScope.refreshFunc();
        }
    });

    // 搜索课程
    function searchClass(keyword,type){
        http.getData("/user/search?type="+ type + "&keyword=" + keyword,function(data){
            if(data.status == 0){
                $scope.CarList = data.body;
            }
        });
    }
});
