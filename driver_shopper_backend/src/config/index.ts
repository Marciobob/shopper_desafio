import User from "../models/user.model";
import Viagem from "../models/viagem.model";
import Motorista from "../models/motorista.model";
import sequelize from '../config/database'; // Certifique-se de importar a instância do Sequelize

// 1. Associar User -> Viagem (Um usuário pode ter várias viagens)
User.hasMany(Viagem, { foreignKey: 'customer_id', as: 'viagens' });
Viagem.belongsTo(User, { foreignKey: 'customer_id', as: 'user' });

// 2. Associar Viagem -> Motorista (Cada viagem tem um motorista)
Motorista.hasMany(Viagem, { foreignKey: 'driver_id', as: 'rides' });
Viagem.belongsTo(Motorista, { foreignKey: 'driver_id', as: 'driver' });
// (async () => {
//     try {
//       await sequelize.sync({ force: true }); // Recria as tabelas
//       console.log('Banco de dados sincronizado.');
//     } catch (error) {
//       console.error('Erro ao sincronizar o banco:', error);
//     }
//   })();
export default sequelize;
