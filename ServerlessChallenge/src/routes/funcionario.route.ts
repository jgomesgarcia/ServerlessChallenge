import express from "express";
import { AtualizarFuncionario, CadastrarFuncionario, ExcluirFuncionario, ObterTodosFuncionarios, ObterFuncionarioPorCPF } from '../services/funcionario.service'

const router = express.Router();

router.get('/', ObterTodosFuncionarios)
router.get('/:cpf', ObterFuncionarioPorCPF)
router.post('/create', CadastrarFuncionario)
router.put('/update/:cpf', AtualizarFuncionario)
router.delete('/delete/:cpf', ExcluirFuncionario)
  
export default router