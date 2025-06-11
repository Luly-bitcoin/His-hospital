import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';

export const mostrarLogin = (req, res) => {
  res.render('login'); 
};

export const mostrarRegistro = (req, res) => {
  res.render('registrar'); 
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const rows = await sequelize.query(
      'SELECT * FROM usuarios WHERE username = ?', 
      {
        replacements: [username],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (rows.length === 0) {
      return res.render('login', { error: 'Usuario no encontrado' });
    }

    const user = rows[0];

    if (!user.pasword) {
      return res.render('login', { error: 'Error: usuario sin contraseña en base de datos' });
    }

    const match = await bcrypt.compare(password, user.pasword);

    if (!match) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    req.session.user = { id: user.id, username: user.username, rol: user.rol };
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Error en el proceso de login' });
  }
};

export const registrar = async (req, res) => {
  const { username, pasword, codigoSecreto } = req.body;

  if (!codigoSecreto) {
    return res.render('registrar', { error: 'El código secreto es obligatorio' });
  }

  try {
    const codigoRows = await sequelize.query(
      'SELECT * FROM codigos_secretos WHERE codigo = ?',
      {
        replacements: [codigoSecreto],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (codigoRows.length === 0) {
      return res.render('registrar', { error: 'Código secreto incorrecto' });
    }

    const rol = codigoRows[0].rol;

    const userRows = await sequelize.query(
      'SELECT * FROM usuarios WHERE username = ?',
      {
        replacements: [username],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (userRows.length > 0) {
      return res.render('registrar', { error: 'Nombre de usuario ya en uso' });
    }

    const hashedPasword = await bcrypt.hash(pasword, 10);

    await sequelize.query(
      'INSERT INTO usuarios (username, pasword, rol) VALUES (?, ?, ?)',
      {
        replacements: [username, hashedPasword, rol],
        type: sequelize.QueryTypes.INSERT
      }
    );

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('registrar', { error: 'Error al registrar usuario' });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
