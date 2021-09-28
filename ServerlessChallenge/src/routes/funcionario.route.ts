import express from "express";
import { AtualizarFuncionario, CadastrarFuncionario, ExcluirFuncionario, ObterTodosFuncionarios, ObterFuncionarioPorCPF } from '../services/funcionario.service'
import Authenticator from "../middlewares/authenticator";
const router = express.Router();

router.get('/', Authenticator, ObterTodosFuncionarios)
router.get('/:cpf', Authenticator, ObterFuncionarioPorCPF)
router.post('/create', Authenticator, CadastrarFuncionario)
router.put('/update/:cpf', Authenticator, AtualizarFuncionario)
router.delete('/delete/:cpf', Authenticator, ExcluirFuncionario)
  
export default router