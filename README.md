# imooc-node-basic
参考慕课网Node建站视频~~~搭建的网站。非常推荐去学习一下，http://www.imooc.com/video/1090

#安装项目所需环境
`npm install`

#运行
`grunt`

#单元测试
`grunt test`

#代码结构
imooc-node-basic

    + .git
    + bower_components
    + node_modules
    + app
        + controllers
            + category.js
            + comment.js
            + index.js
            + movie.js
            + user.js
        + models
            + category.js
            + comment.js
            + movie.js
            + user.js
        + schemas
            + category.js
            + comment.js
            + movie.js
            + user.js
        + views
            + includes
                + head.jade
                + header.jade
            + pages
                + category_admin.jade
                + categorylist.jade
                + detail.jade
                + index.jade
                + list.jade
                + movie_admin.jade
                + results.jade
                + signin.jade
                + signup.jade
                + userlist.jade
            + layout.jade
    + config
        + routes.js
    + public
        + js
            + admin.js
            + detail.js
    + test
        + user
            + user.js
    + .gitignore
    + .jshintrc
    + app.js
    + bower.json
    + gruntfile.js
    + package.json
    + READE.md    


#URL
+ localhost:3000
+ localhost:3000/signup
+ localhost:3000/signin
+ localhost:3000/admin/movie/new
+ localhost:3000/admin/movie/list
+ localhost:3000/movie/572b0d5525f7a00c1cdbc78a


#后续
将参考[豆瓣电影音乐网站](https://github.com/Loogeek/douban_Website)完善一下
