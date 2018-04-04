/**
 * Created by MacBook Air on 2017/5/17.
 */
var mongoose = require("mongoose");
var QuestionSchema = require("../schemas/question");
var Question = mongoose.model("question",QuestionSchema);
module.exports = Question;