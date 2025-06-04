import bcrypt from 'bcrypt';
import {conexion} from '../config/db.js'; 

export const mostrarLogin = (req, res) => {
  res.render('login'); 
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await conexion.query('SELECT * FROM usuarios WHERE username = ?', [username]);

  if (rows.length === 0) {
    return res.render('login', { error: 'Usuario no encontrado' });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render('login', { error: 'Contraseña incorrecta' });
  }

  req.session.user = { id: user.id, username: user.username, rol: user.rol };
  res.redirect('/');
};

export const mostrarRegistro = (req, res) => {
  res.render('registrar'); 
};

export const registrar = async (req, res) => {
  const { username, password, codigoSecreto } = req.body;

  try {
    const [codeRows] = await conexion.query(
      'SELECT * FROM codigos_secretos WHERE codigo = ?',
      [codigoSecreto]
    );

    if (codeRows.length === 0) {
      return res.render('registrar', { error: 'Código secreto incorrecto' });
    }

    const rol = codeRows[0].rol;

    const [userRows] = await conexion.query(
      'SELECT * FROM usuarios WHERE username = ?',
      [username]
    );
    if (userRows.length > 0) {
      return res.render('registrar', { error: 'Nombre de usuario ya en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await conexion.query(
      'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)',
      [username, hashedPassword, rol]
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
