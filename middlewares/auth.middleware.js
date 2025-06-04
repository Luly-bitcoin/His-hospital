export function requireLogin(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
}

export function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    if (rolesPermitidos.includes(req.user.rol)) {
      next();
    } else {
      res.status(403).send('Acceso no autorizado');
    }
  };
}
export function checkRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send('No autenticado');
    if (rolesPermitidos.includes(req.user.rol)) {
      next();
    } else {
      res.status(403).send('Acceso no autorizado');
    }
  };
}
