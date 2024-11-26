import { Request, Response } from 'express';
import Motorista from '../models/motorista.model';
import Viagem from '../models/viagem.model';
import { Client } from '@googlemaps/google-maps-services-js';
import UserService from '../services/user.service';
import User from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const client = new Client();

interface Driver {
  id: number | null; 
  name: string | null; 
}

interface Ride {
  id: number;
  date: Date | string; // Aceita ambos os tipos
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: Driver;
  value: number;
}


//Confirmar Viagem
export const confirmRide = async (req: Request, res: Response) : Promise<any>=> {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
  // 1. Validação dos dados recebidos
  if (!customer_id || !origin || !destination || !driver || !distance || !duration || !value) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Todos os campos são obrigatórios',
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os endereços de origem e destino não podem ser os mesmos',
    });
  }

  // 2. Verificar se o motorista existe
  const motorista = await Motorista.findByPk(driver.id);
  if (!motorista) {
    return res.status(404).json({
      error_code: 'DRIVER_NOT_FOUND',
      error_description: 'Motorista não encontrado',
    });
  }

  // 3. Validar a quilometragem
  if (distance < motorista.minKm) {
    return res.status(406).json({
      error_code: 'INVALID_DISTANCE',
      error_description: 'A quilometragem informada é inválida para o motorista selecionado',
    });
  }

  // 4. Calcular o valor da viagem 
  const calculatedValue = parseFloat((distance * motorista.ratePerKm).toFixed(2));
  if (value !== calculatedValue) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'O valor informado não corresponde ao valor calculado',
    });
  }

  //verificar se user existe se não criar um novo

  // 2. Verificar se o motorista existe
  const usuario = await User.findByPk(customer_id);
  if (!usuario) {
    const newUser = await UserService.createUser(customer_id);
  }


  // 5. Salvar a viagem no banco de dados
  try {
    const viagem = await Viagem.create({
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver_id: motorista.id,
      value,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Erro ao salvar viagem:', error);
    return res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Erro ao salvar a viagem',
    });
  }
};

// Calcular viagem
export const estimateRide = async (req: Request, res: Response): Promise<any> => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination) {
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Campos obrigatórios: customer_id, origin e destination.',
    });
    return;
  }

  if (origin === destination) {
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os endereços de origem e destino não podem ser iguais.',
    });
    return;
  }

  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_API_KEY as string,
      },
    });

    const route = response.data.routes[0];
    if (!route) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Não foi possível calcular a rota com os endereços fornecidos.',
      });
      return;
    }

    const leg = route.legs[0];
    const distanceInKm = leg.distance.value / 1000;
    const duration = leg.duration.text;
    const originLatLng = leg.start_location;
    const destinationLatLng = leg.end_location;

    const availableDrivers = await Motorista.findAll()
      
    const res_motoristas = availableDrivers.filter(driver => distanceInKm >= driver.minKm)
      .map(driver => (
        {
        id: driver.dataValues.id,
        name: driver.dataValues.name,
        description: driver.dataValues.description,
        vehicle: driver.dataValues.car,
        review: {
          rating: driver.dataValues.rating,
          comment: driver.dataValues.description,
        },
        value: parseFloat((distanceInKm * driver.dataValues.ratePerKm).toFixed(2)),
      }))
      .sort((a, b) => a.value - b.value);

    if (availableDrivers.length === 0) {
      res.status(404).json({
        error_code: 'NO_DRIVERS',
        error_description: 'Nenhum motorista disponível para a distância informada.',
      });
      return;
    }
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x600&path=color:0d1723|weight:5|${originLatLng.lat},${originLatLng.lng}|${destinationLatLng.lat},${destinationLatLng.lng}&markers=color:red|${originLatLng.lat},${originLatLng.lng}&markers=color:green|${destinationLatLng.lat},${destinationLatLng.lng}&key=${process.env.GOOGLE_API_KEY as string}`;

    res.status(200).json({
      origin: {
        latitude: originLatLng.lat,
        longitude: originLatLng.lng,
      },
      destination: {
        latitude: destinationLatLng.lat,
        longitude: destinationLatLng.lng,
      },
      distance: distanceInKm,
      duration,
      options: res_motoristas,
      routeResponse: route,
      urlMapa:mapUrl
    });
  } catch (error) {
    console.error('Erro ao calcular a rota:', error);
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
    });
  }
};


// Listar viagens
export const listRide = async (req: Request, res: Response): Promise<any> => {
  try {
    const { customer_id, driver_id } = req.params;

    // Validação 1: O `customer_id` não pode estar em branco
    if (!customer_id) {
      return res.status(400).json({
        error_code: "INVALID_CUSTOMER",
        error_description: "O ID do usuário não pode estar em branco.",
      });
    }

    // Validação 2: Se `driver_id` for informado, verificar se é válido
    if (driver_id) {
      const motorista = await Motorista.findByPk(driver_id);
      if (!motorista) {
        return res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "O ID do motorista é inválido.",
        });
      }
    }

    // Construir condições de busca
    const whereConditions: any = { customer_id };
    if (driver_id) {
      whereConditions.driver_id = driver_id;
    }

    // Buscar as viagens no banco de dados
    const viagens = await Viagem.findAll({
      where: whereConditions,
      order: [["createdAt", "DESC"]], // Ordenar da mais recente para a mais antiga
      include: [
        {
          model: Motorista,
          as: "driver", // Alias definido no relacionamento Viagem -> Motorista
        },
        {
          model: User,
          as: "user", // Alias definido no relacionamento Viagem -> User
        },
      ],
    });

    // Verificar se encontrou viagens
    if (viagens.length === 0) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhuma viagem encontrada para o usuário informado.",
      });
    }

    // Construir a resposta
    const response = {
      customer_id,
      rides: viagens.map((viagem): Ride => ({
        id: viagem.id,
        date: viagem.createdAt,
        origin: viagem.origin,
        destination: viagem.destination,
        distance: viagem.distance,
        duration: viagem.duration,
        driver: {
          id: viagem.driver?.id || null,
          name: viagem.driver?.name || null,
        },
        value: viagem.value,
      })),
    };

    // Retornar a resposta com sucesso
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "Ocorreu um erro ao processar a solicitação.",
    });
  }
};
