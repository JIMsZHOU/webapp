/**
 * Created by MacBook Air on 2017/5/17.
 */
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    num:String,
    name:String,
    password:String,
    school:String,
    major:String,
    history:Array,
    create:{type:Date,default:Date.now()}
});
module.exports = UserSchema;