exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')
  res.locals.user = req.session.user
  
  next();
};

exports.checkCrsfError = (err, req, res, next) => {
  if (err) {
    return res.render("../views/404.ejs");
  }
  next()
};

exports.sendCsrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req,res,next) =>{
  
  if(!req.session.user){
    req.session.save(()=>{ 
      req.flash('errors','user is not logged in')     
      return res.redirect('/login')    
    })    
  }
  else{

    next()
  }

}
