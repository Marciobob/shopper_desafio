import imagem_carro from "../../public/carro.png";
import logo from "../../public/logo.png";
import '../App.css';

type HomeProps = {
  displayStart: boolean;
  setDisplayStart: (value: boolean) => void;
};

function Home({ displayStart, setDisplayStart }: HomeProps) {
  return (
    <>
      {!displayStart && (
        <div className='flex flex-col-reverse md:flex-row bg-fundo'>
          <div className='flex md:w-[50%] md:h-[100vh] rounded-tr-[10%] rounded-br-[10%] items-center'>
            <img src={imagem_carro} alt="baner carro" className='ml-auto mt-auto' />
          </div>
          <div className='flex md:w-[50%] md:h-[100vh] rounded-br-[10%]'>
            <div className='flex flex-col items-center mt-24 p-4'>
              <img width={280} height={280} src={logo} alt="logo" className='mr-auto' />
              <h1 className='fonte-sans text-white text-2xl font-bold mt-4'>
                Chegue mais rápido, viaje com confiança.
              </h1>
              <button
                onClick={() => setDisplayStart(!displayStart)}
                className="p-2 rounded-md text-white font-semi-bold bg-primary w-full mt-8 bg-primary hover:opacity-75"
              >
                Iniciar Viagem
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
