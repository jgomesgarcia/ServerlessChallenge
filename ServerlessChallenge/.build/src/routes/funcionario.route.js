"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const funcionario_service_1 = require("../services/funcionario.service");
const router = express_1.default.Router();
router.get('/', funcionario_service_1.ObterTodosFuncionarios);
router.get('/:cpf', funcionario_service_1.ObterFuncionarioPorCPF);
router.post('/create', funcionario_service_1.CadastrarFuncionario);
router.put('/:cpf/update', funcionario_service_1.AtualizarFuncionario);
router.delete('/:cpf/delete', funcionario_service_1.ExcluirFuncionario);
exports.default = router;
//# sourceMappingURL=funcionario.route.js.map