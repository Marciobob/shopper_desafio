import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';


class User extends Model {
  public id!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
