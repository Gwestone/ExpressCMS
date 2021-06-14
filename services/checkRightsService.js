function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    return next();
  }
}

async function checkIsAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    var user = await req.user
    var isAdmin = user.acessRights >= 2
    if(isAdmin){
      return next()
    }else{
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}

module.exports = { checkAuthenticated, checkNotAuthenticated, checkIsAdmin };
