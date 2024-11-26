import User from '../models/user.model';

//Listar usuarios
const getAllUsers = async () => {
  return await User.findAll();
};

//cadastrar usuarios
const createUser = async (customer_id: number) => {
  return await User.create({ customer_id });
};

//Atualizar usuarios
const updateUser = async (customer_id: number) => {
  const user = await User.findByPk(customer_id);
  if (!user) throw new Error('Usuário não encontrado');

  await user.save();

  return user;
};

//Deletar usuarios
const deleteUser = async (customer_id: number) => {
  const user = await User.findByPk(customer_id);
  if (!user) throw new Error('Usuário não encontrado');

  await user.destroy();
};

export default { getAllUsers, createUser, updateUser, deleteUser };
