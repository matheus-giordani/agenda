const Login = require("../models/LoginModel");

exports.index = (req, res) => {
    if(req.session.user){
        return res.render('logado')
    }
  
  return res.render("login");
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login");
      });
    } else {
      req.flash("success", "Created user");
      req.session.save(function () {
        return res.redirect("/login");
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login");
      });
    } else {
      req.session.user = login.user;
      req.session.save(function () {
        return res.redirect("/");
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};


exports.logout = (req, res)=>{
    req.session.destroy()
    res.redirect('/login')

}
