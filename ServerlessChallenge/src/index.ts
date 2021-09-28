import express from "express";
import FuncionarioRouter from  './routes/funcionario.route';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/funcionario', FuncionarioRouter)

export default app