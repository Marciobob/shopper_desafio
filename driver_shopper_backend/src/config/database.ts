import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || 'database.sqlite', // Arquivo SQLite
  logging: console.log, // Define explicitamente o console.log para evitar o aviso
});

// Exportar a instância do Sequelize para uso em outros arquivos
export default sequelize;
