import './camas.js';
import './medicos.js';
import './notificaciones.js';
import './paciente.js';
import './turnos.js';

import sequelize from '../config/db.js';

try{
    await sequelize.sync({slter : true});
    console.log('Modelos sincccronizados correctamete');
}catch(error){
    console.error('Error al sincronizar modelos: ', error);
}