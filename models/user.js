/**
 * Created by MacBook Air on 2017/5/17.
 */
var mongoose = require("mongoose");
var UserSchema = require("../schemas/user");
var User = mongoose.model("questionUser",UserSchema);
module.exports = User;