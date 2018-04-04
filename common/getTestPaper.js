/**
 * Created by MacBook Air on 2017/5/22.
 */
module.exports = function(score,judgeArr,selectArr){
    var totalScore = 100;
    var judgeAll = 20;   // 判断题题数
    var selectAll = 20;   // 选择题题数
    var questionList = [];   // 群体数组
    var questionLen = 20;    // 群体长度
    var loopNum = 20;   // 循环次数
    // 根据总分和试题比例生成群体
    for(var i = 0; i < questionLen; i++){
        questionList[i] = [];
        for(var j = 0; j < judgeAll; j++){   // 生成判断题
            var num = Math.floor(Math.random() * judgeArr.length);
            questionList[i].push(judgeArr[num]);
            judgeArr.splice(num,1);
        }
        for(var j = 0; j < selectAll; j++){   // 生成选择题
            var num = Math.floor(Math.random() * selectArr.length);
            questionList[i].push(selectArr[num]);
            selectArr.splice(num,1);
        }
    }

    // 迭代循环
    for(var i = 0; i < loopNum; i++){
        getBestQuestion();
    }

    // 计算每套题的难度系数，剔除后10
    function getBestQuestion(){
        var middleIndex = 10;

        getParam();   // 获取每套题的难度系数

        questionList.sort(function(a,b){   // 根据难度系数与去期望值差值排序
            return Math.abs(b.degree - score) - Math.abs(a.degree - score);
        });

        // 生成后代
        getChildren(middleIndex);

    }
    // 生成后代
    function getChildren(endIndex){
        var arr = [];
        var indexArr = [0,1,2,3,4,5,6,7,8,9];
        for(var i = 0; i < endIndex; i++){
            var num = Math.floor(Math.random() * indexArr.length);
            arr.push(indexArr[num]);
            indexArr.splice(num,1);
        }
        for(var i = 0; i < arr.length; i += 2){
            for(var j = 0; j < questionList[arr[i]].length;j++){
                var boolean = Math.floor(Math.random() * 2);
                if(boolean == 0){
                    questionList[endIndex + i][j] = questionList[arr[i]][j];
                }else{
                    questionList[endIndex + i][j] = questionList[arr[i + 1]][j];
                }
                boolean = Math.floor(Math.random() * 2);
                if(boolean == 0){
                    questionList[endIndex + i + 1][j] = questionList[arr[i]][j];
                }else{
                    questionList[endIndex + i + 1][j] = questionList[arr[i + 1]][j];
                }

            }
        }
    }

    // 计算一套题的难度系数
    function getParam(){
        for(var i = 0; i < questionLen; i++){
            var middleValue = 0;
            for(var j = 0; j < questionList[i].length; j++){
                middleValue += questionList[i][j].score * questionList[i][j].degree / 5;
            }
            questionList[i].degree = middleValue / totalScore;
        }

    }
};