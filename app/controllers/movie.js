var mongoose = require('mongoose')
var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')
// var formidable = require('formidable')
var multiparty = require('multiparty');

// detail page
exports.detail = function(req, res) {
  var id = req.params.id

  Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
    if (err) {
      console.log(err)
    }
  })

  Movie.findById(id, function(err, movie) {
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments) {
        res.render('detail', {
          title: 'imooc 详情页',
          movie: movie,
          comments: comments
        })
      })
  })
}

// movie_admin new page
exports.new = function(req, res) {
  Category.find({}, function(err, categories) {
    res.render('movie_admin', {
      title: 'imooc 后台录入页',
      categories: categories,
      movie: {}
    })
  })
}

// movie_admin update page
exports.update = function(req, res) {
  var id = req.params.id

  if (id) {
    Movie.findById(id, function(err, movie) {
      Category.find({}, function(err, categories) {
        res.render('movie_admin', {
          title: 'imooc 后台更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}

// movie_admin poster
exports.savePoster = function(req, res, next) {
    // var form = new formidable.IncomingForm()
    // form.uploadDir = path.join(__dirname, '../../', '/public/tmp')   //文件保存的临时目录为当前项目下的tmp文件夹
    // if (!fs.existsSync(form.uploadDir)) {
    //     fs.mkdir(form.uploadDir)
    // }
    // form.maxFieldsSize = 1 * 1024 * 1024  //用户头像大小限制为最大1M
    // form.keepExtensions = true        //使用文件的原扩展名
    // form.on('error', function(err) {
    //     console.log(err);
    // });
    // form.parse(req, function (err, fields, file) {
    //     var filePath = ''
    //     //如果提交文件的form中将上传文件的input名设置为uploadPoster，就从uploadPoster中取上传文件。否则取for in循环第一个上传的文件。
    //     if(file.uploadPoster){
    //         filePath = file.uploadPoster.path
    //     } else {
    //         for(var key in file){
    //             if( file[key].path && filePath==='' ){
    //                 filePath = file[key].path
    //                 break
    //             }
    //         }
    //     }
    //     if( filePath ){
    //         //文件移动的目录文件夹，不存在时创建目标文件夹
    //         var targetDir = path.join(__dirname, '../../', '/public/upload')
    //         if (!fs.existsSync(targetDir)) {
    //             fs.mkdir(targetDir)
    //         }
    //         var fileExt = filePath.substring(filePath.lastIndexOf('.'))
    //         //判断文件类型是否允许上传
    //         if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
    //             err = new Error('此文件类型不允许上传')
    //             console.log('此文件类型不允许上传')
    //             next()
    //         } else {
    //             //以当前时间戳对上传文件进行重命名
    //             var fileName = new Date().getTime() + fileExt
    //             var targetFile = path.join(targetDir, fileName)
    //             //移动文件
    //             fs.rename(filePath, targetFile, function (err) {
    //                 if (err) {
    //                     console.info(err)
    //                     // res.json({code:-1, message:'操作失败'})
    //                     console.log('文件移动失败')
    //                     next()
    //                 } else {
    //                     //上传成功，返回文件的相对路径
    //                     var fileUrl = 'upload/' + fileName
    //                     req.fields = fields
    //                     req.poster = fileName
    //                     next()
    //                     // res.json({code:0, fields:fields ,fileUrl:fileUrl})
    //                 }
    //             })
    //
    //             process.nextTick(function(){
    //                 fs.unlink(filePath, function(err) {
    //                     if (err) {
    //                         console.info('删除上传时生成的临时文件失败')
    //                         console.info(err)
    //                     } else {
    //                         console.info('删除上传时生成的临时文件')
    //                     }
    //                 })
    //             })
    //         }
    //     }else{
    //         next()
    //     }
    //
    // })
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var posterData = files.uploadPoster[0]
        var filePath = posterData.path
        var originalFilename = posterData.originalFilename

        if (originalFilename) {
          fs.readFile(filePath, function(err, data) {
            var timestamp = Date.now()
            var type = posterData.headers['content-type'].split('/')[1]
            var poster = timestamp + '.' + type
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

            fs.writeFile(newPath, data, function(err) {
              req.body = fields
              req.poster = poster
              next()
            })
          })
        }
        else {
          next()
        }
    });
}

// movie_admin post movie
exports.save = function(req, res) {
    // console.log(req.body)
    // console.log(req.poster)
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  if (req.poster) {
    movieObj.poster = req.poster
  }

  if (id) {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie._id)
      })
    })
  }
  else {
    _movie = new Movie(movieObj)

    var categoryId = movieObj.category
    var categoryName = movieObj.categoryName

    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
      if (categoryId) {
        Category.findById(categoryId, function(err, category) {
          category.movies.push(movie._id)

          category.save(function(err, category) {
            res.redirect('/movie/' + movie._id)
          })
        })
      }
      else if (categoryName) {
        var category = new Category({
          name: categoryName,
          movies: [movie._id]
        })

        category.save(function(err, category) {
          movie.category = category._id
          movie.save(function(err, movie) {
            res.redirect('/movie/' + movie._id)
          })
        })
      }
    })
  }
}

// list page
exports.list = function(req, res) {
  Movie.find({})
    .populate('category', 'name')
    .exec(function(err, movies) {
      if (err) {
        console.log(err)
      }

      res.render('list', {
        title: 'imooc 列表页',
        movies: movies
      })
    })
}

// delete page
exports.delete = function(req, res) {
  var id = req.query.id

  if (id) {
    Movie.remove({_id: id}, function(err, movie) {
      if (err) {
        // console.log(err)
        res.json({success: 0})
      }
      else {
        res.json({success: 1})
      }
    })
  }
}
