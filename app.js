var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var _ = require('underscore');
var port = process.env.PORT || 3000;
var app = express();
app.locals.moment = require('moment');

mongoose.connect('mongodb://localhost/imooc');

// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public')));
// console.info('__dirname',__dirname,path.join(__dirname, 'bower_components'));

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: 'imooc'
}));
app.use(express.static(path.join(__dirname,'bower_components')));
app.listen(port);

console.log('imooc started on port '+port);

// index page
app.get('/',function(req,res){
    console.log("session ");
    console.log(req.session.user)
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title:'影院热度播报',
			movies:movies
		});
	});
});
// signup
app.post('/user/signup', function(req, res){
    var _user = req.body.user;
    User.findOne({name: _user.name}, function(err, user){
        if(err){
            console.log(err)
        }
        if(user){
            return res.redirect('/')
        }else{
            var userNew = new User(_user);
            userNew.save(function(err, userNew){
                if(err){
                    console.log(err);
                }
                res.redirect('/admin/userlist');
            });
        }
    });
});
// signin
app.post('/user/signin', function(req, res){
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name:name}, function(err, user){
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/')
        }

        user.comparePassword(password, function(err, isMatch){
            if(err){
                console.log(err)
            }

            if(isMatch){
                req.session.user = user
                console.log('Password is matched')
                return res.redirect('/')
            }else{
                console.log('Password is not matched')
            }
        })
    });

});

// userList page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'imooc 用户列表页',
			users: users
		});
	});
});

// detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id;

	Movie.findById(id,function(err,movie){
		res.render('detail',{
				title:movie.title,
				movie:movie
		});
	});
});

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页面',
		movie:{
			doctor:'',
			country:'',
			title:'',
			year:'',
			poster:'',
			language:'',
			flash:'',
			summary:''
		}
	});
});

app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页面',
				movie:movie
			});
		});
	}
});
//admin delete movie
app.delete('/admin/list',function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
               console.log(err);
            }else{
                res.json({success:1});
            }
        });
    }

})
// admin post movie
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;

	var _movie;

	if(id !=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}

			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
			    }

			    res.redirect('/movie/'+_movie.id);
			});

		});
	}else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash,
		});

		_movie.save(function(err,movie){
				if(err){
					console.log(err);
			    }

			    res.redirect('/movie/'+_movie.id);
			});
	}
});

app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'imooc 列表页',
			movies:movies
		});
	});
});
