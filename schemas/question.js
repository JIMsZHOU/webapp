/**
 * Created by MacBook Air on 2017/5/17.
 */
var mongoose = require("mongoose");
var QuestionSchema = new mongoose.Schema({
    type:Number,
    content:String,
    options:Object,
    answer:Number,
    detail:String,
    score:Number,
    keyword:String,
    degree:Number,
    create:{type:Date,default:Date.now()}
});
module.exports = QuestionSchema;