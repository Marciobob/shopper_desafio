import React from "react";
import carro2 from "../../public/carro2.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  descricao: string;
  vehicle: string;
  review: number;
  value: number;
  distance: number; 
  duration: string; 
  origin: string;
  destination: string;
  driver_id: number;
};

interface ErrorResponse {
  response?: {
    data?: {
      error_description?: string;
    };
  };
  message?: string;
}
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  id,
  name,
  descricao,
  vehicle,
  review,
  value,
  distance,
  duration,
  origin,
  destination,
  driver_id
}) => {
  if (!isOpen) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();
  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: rating }).map((_, index) => (
          <span
            key={index}
            className={index < rating ? "text-yellow-500" : "text-gray-300"}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  // Função de type guard para garantir que o erro tenha o formato esperado
  function isErrorResponse(error: unknown): error is ErrorResponse {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof error === 'object' && error !== null && 'response' in error && 'data' in (error as any).response
    );
  }

  const handlFinaliza = async () => {

    try {
      const url = 'http://localhost:8080/ride/confirm'; 
      const requestBody = {
        customer_id: Number(id),
        origin,
        destination,
        distance,
        duration,
        driver: {id: Number(driver_id)},
        value
      };
      await axios.post(url, requestBody); 
      alert('Viagem concluida com sucesso')
      navigate(`/ride/${id}`)

    }
    catch (error: unknown) {
      if (isErrorResponse(error)) {

        // Verificando se 'response' e 'data' estão presentes antes de acessar
        if (error.response && error.response.data) {
          alert(`Erro: ${error.response.data.error_description}`);
        } else {
          alert('Erro desconhecido. Detalhes não disponíveis.');
        }
      } else {
        alert('Ocorreu um erro desconhecido.');
      }
    
      // Rejeita a Promise para lidar no código que chamou a função
      throw error;
    }

  };

  return (
    <div className='flex flex-col w-full md:w-[50%] rounded-br-[10%] bg-red-200'>
      <div className="bg-fundo text-white rounded-lg shadow-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Detalhes da Viajem</h2>
          <button
            className="text-white hover:opacity-75"
            onClick={onClose}
          >
            ✖ Cancelar
          </button>
        </div>

        <div className="flex flex-col mb-6 gap-2">
          <div className="flex flex-row mb-2 gap-2 items-center">
            <p className="text-sm text-gray-400">USUARIO:</p>
            <p className="text-sm font-medium">{id}</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm text-gray-400">Motorista:</p>
            <p className="text-sm font-medium">{name}</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm font-medium">{descricao}</p>
          </div>

          <div className="flex flex-col gap-2 items-left">
            <img src={carro2} alt="" className="w-48"/>
            <p className="text-sm font-medium">{vehicle}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-gray-400">Avaliação</p>
            {renderStars(review)}
          </div>

          <div
            className={`flex flex-col rounded-lg justify-between items-left text-white gap-2`}
          >
            <p>Distancia: {distance } Km</p>
            <p>Duração: {duration }</p>
          </div>

          <div className="gap-2">
            <p className="text-sm text-gray-400">Preço</p>
            <p className="text-lg font-bold">$ {value}</p>
          </div>
        </div>

        <button
          className="mt-4 w-full bg-primary hover:opacity-75 text-white font-bold py-2 px-4 rounded"
          onClick={handlFinaliza}
        >
          Confirmar viajem
        </button>
      </div>
    </div>
  );
};

export default Modal;
