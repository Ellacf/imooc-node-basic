var Movie = require('../models/movie');
var User = require('../models/user');
var _ = require('underscore');
module.exports = function(app){
    // pre handle user
    app.use(function(req, res, next){
        console.log("session ");
        console.log(req.session.user);
        var _user = req.session.user;
        if(_user){
            app.locals.user = _user
        }
        return next()
    });
    // index page
    app.get('/',function(req,res){

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
                var user = new User(_user);
                user.save(function(err, user){
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
                    return res.redirect('/')
                }else{
                    console.log('Password is not matched')
                }
            })
        });

    });
    // logout
    app.get('/logout', function(req, res){
        delete req.session.user
        delete app.locals.user
        res.redirect('/')
    })
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
}
