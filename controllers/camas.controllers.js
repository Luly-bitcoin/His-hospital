import sequelize from '../config/db.js';

export const checkLimpieza = async (req, res) => {
  try {
    const [rows] = await sequelize.query('SELECT COUNT(*) AS count FROM camas WHERE estado = ?', ['higienizando']);
    const hayLimpieza = rows[0].count > 0;
    res.json({ hayLimpieza });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmarLimpieza = async (req, res) => {
  try {
    await sequelize.query('UPDATE camas SET estado = ? WHERE estado = ?', ['libre', 'higienizando']);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function actualizarEstadoCama(id, estado) {
  const sql = 'UPDATE camas SET estado = ? WHERE id = ?';
  await db.query(sql, [estado, id]);
}
