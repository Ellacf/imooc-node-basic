//设置头像
exports.avatar = function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'tmp');   //文件保存的临时目录为当前项目下的tmp文件夹
    form.maxFieldsSize = 1 * 1024 * 1024;  //用户头像大小限制为最大1M
    form.keepExtensions = true;        //使用文件的原扩展名
    form.parse(req, function (err, fields, file) {
        var filePath = '';
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if(file.tmpFile){
            filePath = file.tmpFile.path;
        } else {
            for(var key in file){
                if( file[key].path && filePath==='' ){
                    filePath = file[key].path;
                    break;
                }
            }
        }
        //文件移动的目录文件夹，不存在时创建目标文件夹
        var targetDir = path.join(__dirname, 'upload');
        if (!fs.existsSync(targetDir)) {
            fs.mkdir(targetDir);
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        //判断文件类型是否允许上传
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            res.json({code:-1, message:'此文件类型不允许上传'});
        } else {
            //以当前时间戳对上传文件进行重命名
            var fileName = new Date().getTime() + fileExt;
            var targetFile = path.join(targetDir, fileName);
            //移动文件
            fs.rename(filePath, targetFile, function (err) {
                if (err) {
                    console.info(err);
                    res.json({code:-1, message:'操作失败'});
                } else {
                    //上传成功，返回文件的相对路径
                    var fileUrl = '/upload/' + fileName;
                    res.json({code:0, fileUrl:fileUrl});
                }
            });

            process.nextTick(function(){
                fs.unlink(filePath, function(err) {
                    if (err) {
                        console.info("删除上传时生成的临时文件失败");
                        console.info(err);
                    } else {
                        console.info("删除上传时生成的临时文件");
                    }
                });
            });
        }
    });
}
