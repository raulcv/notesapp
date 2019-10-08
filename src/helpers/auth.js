const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); //Si se logueo continue con la siguiente funcion.
    }
    req.flash('error_smg', 'Not Authorized'); //Si no esta logueado, mostramos el smg y redireccionamos a logueo para que se loguee
    res.redirect('/users/signin');
};

module.exports = helpers;