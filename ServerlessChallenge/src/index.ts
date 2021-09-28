import express from "express";
import FuncionarioRouter from  './routes/funcionario.route';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json'

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/funcionario', FuncionarioRouter)

export default app