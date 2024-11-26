/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import '../App.css'
import Home from "../components/Home";
import LandingPage from '../components/LandingPage';



function HomePage() {
  const [displayStart, setDisplayStart] = useState<boolean>(false)

  return (
    <>
      <Home displayStart={displayStart} setDisplayStart={setDisplayStart} />
      
      {!!displayStart &&
        <div className='bg-fundo w-full min-h-screen'>
          <LandingPage setDisplayStart={setDisplayStart} displayStart={false}/>
        
        </div>
      }
      
    </>
  )
}

export default HomePage
