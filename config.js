// 相关配置

module.exports = {
    // 后台管理员用户名和密码
    admin:[
        {
            username:"admin",
            password:"admin"
        }
    ],
    // 分页每页的大小
    pageSize:15,

    aotu: {
        token: 'ppt',
        appid: 'wx3c3c72bc12fdcd5f',
        secret: 'be7dd4671b1a6ddd8a10a9be0cfb0346',
        cached: {},
        menu: {
            "button": [
                {
                    "type":"view",
                    "name": "ppt播放",
                    "url": "http://ppt.sanbeicha.net/app/index.html"
                }
            ]
        }
    }
};