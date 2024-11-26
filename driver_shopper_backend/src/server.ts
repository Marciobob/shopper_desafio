import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 
import sequelize from './config/database'; 
import app from './app';
import './config/index';

// Porta definida no .env ou padrão 8080
const PORT = process.env.PORT || 8080;
// sequelize.sync({ alter: true });

// Sincronização do banco de dados antes de iniciar o servidor
sequelize.sync({ force: false }) // `force: false` para não sobrescrever dados existentes
  .then(() => {
    console.log('Banco de dados conectado e sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1); // Encerra o processo com código de erro
  });
