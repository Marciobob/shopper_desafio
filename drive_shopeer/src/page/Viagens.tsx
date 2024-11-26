import axios from 'axios';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface ErrorResponse {
    response?: {
      data?: {
        error_description?: string;
      };
    };
    message?: string;
}

interface Driver {
    id: number;
    name: string;
  }

function Viagens() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedMotorista, setSelectedMotorista] = useState<string>("");
    const [viajens, setViagems] = useState<
        Array<{
            id: number;
            date: string;
            origin: string;
            destination: string;
            distance: number;
            duration: string;
            driver: Driver;
            value: number;
    }>
        >([]);
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

    useEffect(() => {
        handlViagens(String(id))
        handlMotoristas()
    }, [])
    
    // Função de type guard para garantir que o erro tenha o formato esperado
    function isErrorResponse(error: unknown): error is ErrorResponse {
        return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof error === 'object' && error !== null && 'response' in error && 'data' in (error as any).response
        );
    }
    
    const handlViagens = async (id:string) => {
        try {
          const url = `http://localhost:8080/ride/${id}`; 
          const response = await axios.get(url);
          setViagems(response.data.rides)
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

    const handlMotoristas = async () => {
        try {
          const url = `http://localhost:8080/motoristas/getAllMotoristas`;
          const response = await axios.get(url); 
 
            setMotoristas(response.data)
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

    const handleNavigation = () => {
        navigate('/');
    };

    const handlPesquisa = async () => {
        try {
            const url = `http://localhost:8080/ride/${id}/${selectedMotorista}`; 
            const response = await axios.get(url); 
            setViagems(response.data.rides)
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

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMotorista(event.target.value);
    };

  return (
      
    <div className='flex flex-col bg-fundo w-full min-h-screen p-4 '>
        <div className="flex mb-4">
            <button
                className="text-white hover:opacity-75 ml-auto"
                onClick={handleNavigation}
            >
                Voltar
            </button>
        </div>

        <h1 className="text-xl font-bold mb-4 text-white">Histórico de Viagens</h1>
        <div className='flex flex-row gap-4'>
            <select
                onChange={handleSelectChange}
                name="motoristas"
                id="motoristas"
                className="mt-4 mb-4 mt-auto text-white w-[80%] p-3 outline-none focus:ring-2 focus:ring-primary focus:rounded-md focus:border-b-primary bg-fundo border border-fundo border-b-white"
            >
                {motoristas.length > 0 &&
                    motoristas.map((motorista) => (
                        <option key={motorista.id} value={motorista.id}>{motorista.name}</option>
                    ))
                }
            </select>
            <button
                onClick={(handlPesquisa)}
                type="button"
                className="w-[22%] h-12 mb-4 mt-auto bg-primary hover:opacity-75 text-white font-bold py-3 rounded-md transition"
            >
                Pesquisar
            </button>
        </div>
        <div className='overflow-auto max-h-[70vh]'>
          <table className=" border-collapse border border-primary text-white ">
              <thead className='sticky top-0 bg-fundo'>
                <tr className='bg-fund p-0'>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">ID</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Data</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Origem</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Destino</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Distância (km)</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Duração</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Motorista</th>
                    <th className="border border-primary px-4 py-2 bg-fundo text-left">Valor (R$)</th>
                </tr>
              </thead>
              <tbody className='max-h[30vh] overflow-auto'>
                {viajens?.map((ride) => (
                    <tr key={ride.id}>
                    <td className="border border-primary px-4 py-2">{ride.id}</td>
                    <td className="border border-primary px-4 py-2">
                        {new Date(ride.date).toLocaleString("pt-BR")}
                    </td>
                    <td className="border border-primary px-4 py-2">{ride.origin}</td>
                    <td className="border border-primary px-4 py-2">{ride.destination}</td>
                    <td className="border border-primary px-4 py-2">{ride.distance.toFixed(2)}</td>
                    <td className="border border-primary px-4 py-2">{ride.duration}</td>
                    <td className="border border-primary px-4 py-2">{ride.driver.name}</td>
                    <td className="border border-primary px-4 py-2">
                        {ride.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        })}
                    </td>
                    </tr>
                ))}
              </tbody>
          </table>
  
        </div>
    </div>

    )
}

export default Viagens
