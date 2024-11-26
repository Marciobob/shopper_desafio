import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';
import errorMiddleware from './middlewares/error.middleware';
import rideRoutes from './routes/ride.routes';
import motoristaRoutes from './routes/motoristas.routes';
import cors from 'cors'; 

const app: Application = express();
app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

//Configurar as rotas
app.use('/users', userRoutes);
app.use('/ride', rideRoutes);
app.use('/motoristas', motoristaRoutes);

//Middleware global para tratamento de erros
app.use(errorMiddleware);

export default app;
