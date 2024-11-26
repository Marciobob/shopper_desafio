/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import mapa from "../../public/mapa.png";
import axios from 'axios';
import Modal from '../components/ModalMotorista';

type Motorista = {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    
  }
  value: number;
  distance: number; // Distância em quilômetros
  duration: string; // Tempo estimado no formato "X hours Y mins"
};

interface TripDetails {
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number; // Distância em quilômetros
  duration: string; // Tempo estimado no formato "X hours Y mins"
  options: Array<{
    name: string; // Nome do motorista
    description: string; // Descrição do motorista
    vehicle: string; // Modelo do veículo
    rating: number; // Avaliação do motorista (0-5)
    price: number; // Valor da viagem
  }>;
  origin: {
    latitude: number;
    longitude: number;
  };
  routeResponse: {
    bounds: {
      northeast: {
        latitude: number;
        longitude: number;
      };
      southwest: {
        latitude: number;
        longitude: number;
      };
    };
    // [key: string]: any; // Dados adicionais dinâmicos
  };
  urlMapa:string
}

interface ErrorResponse {
  response?: {
    data?: {
      error_description?: string;
    };
  };
  message?: string;
}

type HomeProps = {
  displayStart: boolean;
  setDisplayStart: (value: boolean) => void;
};

function LandingPage({ setDisplayStart }: HomeProps) {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [idUser, setIdUser] = useState('');
  const [error, setError] = useState('');
  const [motoristas, setMotoristas] = useState<
    Array<{
      id: number;
      name: string;
      descricao: string;
      vehicle: string;
      review: {
        rating: number;
        
      }
      value: number;
  }>
    >([]);
  const [resSubmit, setResSubmit] = useState<TripDetails |null >(null);
  const [motoristaSelecionado, setMotoristaSelecionado] = useState<Motorista|null>(null);
  const [isModalOpen, setModalOpen] = useState(false);


  const handleEscolher = (motorista: any | Motorista) => {
    motorista['distance']=resSubmit?.distance
    motorista['duration']=resSubmit?.duration
    setMotoristaSelecionado(motorista);
    setModalOpen(true)
  };



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
      typeof error === 'object' && error !== null && 'response' in error && 'data' in (error as any).response
    );
  }

  const handleRouteSubmission = async () => {
    if (!startAddress || !endAddress) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (startAddress == endAddress) {
      alert(`Os endereços de saida e chegada não pode ser iguais`);
      return
    }
    setError('');

    const url = 'http://localhost:8080/ride/estimate'; 
    const requestBody = {
      customer_id: Number(idUser),
      origin:startAddress,
      destination:endAddress,
    };
  
    const response = await axios.post(url, requestBody); 
    try {
      setMotoristas(response.data.options)
      setResSubmit(response.data)

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
    <div className='flex flex-col-reverse md:flex-row bg-fundo overflow-hidden'>

      {/* CALCULAR VIAJEM */}
      {motoristas.length == 0 &&
        <>
          <div className='hidden md:inline-flex flex w-full md:w-[50%] h-[100vh] rounded-tr-[10%] rounded-br-[10%] items-center'>
            <img src={mapa} alt="baner mapa" className='ml-auto max-h-[100vh] w-full' />
          </div>
          <div className='flex flex-col w-full md:w-[50%] md:h-[100vh] rounded-br-[10%]'>
            <button
              onClick={() => {
                setDisplayStart(false)
                setResSubmit(null)
                setStartAddress('')
                setEndAddress('')
                setMotoristas([])
              }}
              className={`text-lg font-bold text-white ml-auto mr-4 mt-2 hover:opacity-75`}>
              Voltar
            </button>
            <div className='flex flex-col items-left mt-20 p-8'>
              <h1 className='fonte-sans text-white text-2xl font-bold mt-4 '>
                Calcular Viajem
              </h1>
              <div className="md:w-96 mt-4">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  handleRouteSubmission()
                }}>

                  <div className="mb-4">
                    <input
                      type="text"
                      id="idUser"
                      value={idUser}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,3}$/.test(value)) {
                          setIdUser(value);
                        }
                      }}
                      placeholder="Digite o id do usuario"
                      className="text-white w-full p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-md focus:border-b-primary bg-fundo border border-fundo border-b-white"
                    />
                  </div>
                  <div className="mb-4 flex items-center">
                    {/* <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="p-3 bg-primary text-white rounded-l-md flex items-center justify-center hover:bg-secondary transition"
                    title="Pegar minha localização"
                  >
                    📍
                  </button> */}
                    <input
                      type="text"
                      id="startAddress"
                      value={startAddress}
                      onChange={(e) => setStartAddress(e.target.value)}
                      placeholder="Digite o endereço de partida"
                      className="text-white w-full p-3 outline-none focus:ring-2 focus:ring-primary focus:rounded-md focus:border-b-primary bg-fundo border border-fundo border-b-white"
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="text"
                      id="endAddress"
                      value={endAddress}
                      onChange={(e) => setEndAddress(e.target.value)}
                      placeholder="Digite o endereço de chegada"
                      className="text-white w-full p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:rounded-md focus:border-b-primary bg-fundo border border-fundo border-b-white"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-primary hover:opacity-75 text-white font-bold py-3 rounded-md transition"
                  >
                    Caulcular Viajem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      }

      {/* MOTORISTAS PARA VIAJEM */}
      {motoristas.length > 0 && isModalOpen == false &&
        <>
          <div className='md:inline-flex flex w-full md:w-[50%] p-2 mt-4 md:mt-0 rounded-tr-[10%] rounded-br-[10%]' >
            <img src={resSubmit?resSubmit?.urlMapa :mapa} alt="baner mapa" className='bg-cover ml-auto max-h-[100vh] w-full cover rounded-md' />
          </div>
          <div className='flex flex-col  w-full md:w-[50%] rounded-br-[10%]'>
            <button onClick={() => {
              setResSubmit(null)
              setStartAddress('')
              setEndAddress('')
              setMotoristas([])
            }} className={`text-lg font-bold text-white ml-auto mr-4 mt-2 hover:opacity-75`}>Voltar</button>

            <div
              className={`flex flex-col rounded-lg mb-4 justify-between items-left text-white ml-4 gap-2`}
            >
              <p>Distancia: {resSubmit?.distance } Km</p>
              <p>Duração: {resSubmit?.duration }</p>
            </div>

            <h3 className={`text-lg font-bold text-white ml-4 mb-1`}>Motoristas disponiveis</h3>
            <div className='max-h-[70vh] hover:overflow-auto overflow-auto md:overflow-hidden pr-4'>

            {motoristas.map((motorista) => (
                <div
                  key={motorista.id}
                  className={`border border-primary p-4 rounded-lg mb-4 flex justify-between items-center text-white ml-4 mt-4 gap-2`}
                >
                  <div>
                    <h3 className={`text-lg font-bold`}>{motorista.name}</h3>
                    <p>{motorista.descricao}</p>
                    <p>Veículo: {motorista.vehicle}</p>
                    {renderStars(motorista.review.rating)}
                    <p>Valor: R$ {motorista.value}</p>
                  </div>
                  <button
                  onClick={() => {
                    handleEscolher(motorista)
                  }}
                    className={`bg-primary hover:opacity-75 text-white px-4 py-2 rounded-lg`}
                  >
                    Escolher
                  </button>
                </div>
              ))}
            </div>

        </div>
        </>
      }

      {/* FINALIZAR VIAJEM */}
      {motoristaSelecionado && isModalOpen == true &&
        <>
          <div className='md:inline-flex flex w-full md:w-[50%] p-2 mt-4 md:mt-0 rounded-tr-[10%] rounded-br-[10%]' >
            <img src={resSubmit?resSubmit?.urlMapa :mapa} alt="baner mapa" className='bg-cover ml-auto max-h-[100vh] w-full cover rounded-md' />
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            id={idUser}
            name={motoristaSelecionado.name}
            descricao={motoristaSelecionado.description}
            vehicle={motoristaSelecionado.vehicle}
            review={motoristaSelecionado.review.rating}
            value={motoristaSelecionado.value}
            distance={motoristaSelecionado.distance}
            duration={motoristaSelecionado.duration}
            origin={startAddress}
            destination={endAddress} 
            driver_id={motoristaSelecionado.id}
          />
        </>
      }

    </div>

  );
}

export default LandingPage;
