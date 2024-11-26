import { Request, Response } from 'express';
import Motorista from '../models/motorista.model';


// Criar um novo motorista
export const createMotorista = async (req: Request, res: Response): Promise<any> => {
  const { name, description, car, rating, ratePerKm, minKm } = req.body;

  // Validação de campos obrigatórios
  if (!name || !car || ratePerKm === undefined || minKm === undefined) {
    return res.status(400).json({
      message: 'Os campos nome, carro, taxa por km e quilometragem mínima são obrigatórios.',
    });
  }

  try {
    // Criação do motorista
    const motorista = await Motorista.create({
      name,
      description,
      car,
      rating: rating || 0, // Default para 0 caso não seja informado
      ratePerKm,
      minKm,
    });

    return res.status(201).json(motorista);
  } catch (error) {
    console.error('Erro ao criar motorista:', error);
    return res.status(500).json({ message: 'Erro ao criar motorista' });
  }
};

//Buscar todos os motoristas
export const getAllMotoristas = async (req: Request, res: Response) => {
  try {
    const motoristas = await Motorista.findAll();
    res.status(200).json(motoristas);
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    res.status(500).json({ message: 'Erro ao buscar motoristas' });
  }
};

//Buscar motorista por ID
export const getMotoristaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const motorista = await Motorista.findByPk(id);
    if (motorista) {
      res.status(200).json(motorista);
    } else {
      res.status(404).json({ message: 'Motorista não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar motorista:', error);
    res.status(500).json({ message: 'Erro ao buscar motorista' });
  }
};

//Atualizar motorista
export const updateMotorista = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, car, rating, ratePerKm, minKm } = req.body;

  try {
    const motorista = await Motorista.findByPk(id);
    if (motorista) {
      motorista.name = name || motorista.name;
      motorista.description = description || motorista.description;
      motorista.car = car || motorista.car;
      motorista.rating = rating || motorista.rating;
      motorista.ratePerKm = ratePerKm || motorista.ratePerKm;
      motorista.minKm = minKm || motorista.minKm;

      await motorista.save();
      res.status(200).json(motorista);
    } else {
      res.status(404).json({ message: 'Motorista não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error);
    res.status(500).json({ message: 'Erro ao atualizar motorista' });
  }
};

//Remover motorista
export const deleteMotorista = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const motorista = await Motorista.findByPk(id);
    if (motorista) {
      await motorista.destroy();
      res.status(200).json({ message: 'Motorista removido com sucesso' });
    } else {
      res.status(404).json({ message: 'Motorista não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir motorista:', error);
    res.status(500).json({ message: 'Erro ao excluir motorista' });
  }
};
