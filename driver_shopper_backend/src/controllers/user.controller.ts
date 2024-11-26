import { Request, Response } from 'express';
import UserService from '../services/user.service';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const newUser = await UserService.createUser(user);
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const updatedUser = await UserService.updateUser(user);
    res.json(updatedUser);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(Number(id));
    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export default { getAllUsers, createUser, updateUser, deleteUser };
