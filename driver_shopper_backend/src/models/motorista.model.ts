import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';


class Motorista extends Model {
  ratePerKm: any;
  id: any;
  minKm: any;
  name: any;
  description: any;
  car: any;
  rating: any;
}

Motorista.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    car: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    ratePerKm: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, 
      },
    },
    minKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, 
      },
    },
  },
  {
    sequelize,
    modelName: 'Motorista',
    tableName: 'motoristas', 
  }
);

export default Motorista;
