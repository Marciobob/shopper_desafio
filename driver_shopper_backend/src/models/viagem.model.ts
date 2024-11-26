import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';



class Viagem extends Model {
  id!: number;
  createdAt!: Date;
  origin!: string;
  destination!: string;
  distance!: number;
  duration!: string;
  driver: any;
  value!: number;
}

Viagem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER, // Certifique-se de que o tipo corresponde ao `id` no modelo User
      allowNull: false,
      references: {
        model: 'users', // Nome da tabela do modelo User
        key: 'id',      // Nome da coluna primária no modelo User
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // Pode ser 'SET NULL' ou outra regra dependendo da lógica do negócio
    },    
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER, // O tipo deve ser compatível com a chave primária do modelo Motorista
      allowNull: false, // Defina como obrigatório se sempre precisar de um motorista para a viagem
      references: {
        model: 'motoristas', // Nome da tabela associada ao modelo Motorista
        key: 'id', // A coluna primária da tabela Motorista
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // Altere para 'SET NULL' ou 'RESTRICT', dependendo da sua lógica de negócio
    },
    
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Viagem',
    tableName: 'viagens', // Nome da tabela no banco de dados
  }
);


export default Viagem;
