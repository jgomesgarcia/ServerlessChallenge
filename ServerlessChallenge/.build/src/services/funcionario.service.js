"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcluirFuncionario = exports.AtualizarFuncionario = exports.CadastrarFuncionario = exports.ObterFuncionarioPorCPF = exports.ObterTodosFuncionarios = void 0;
const mysql_1 = __importDefault(require("mysql"));
const connection = mysql_1.default.createConnection({
    host: process.env?.DB_HOST,
    user: process.env?.DB_USER,
    password: process.env?.DB_PASSWORD,
    database: process.env?.DB_DATABASE_TABLE,
    port: process.env?.DB_Port ? Number(process.env?.DB_Port) : 3306
});
const ObterTodosFuncionarios = async (req, res) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario";
        const consulta = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
        const funcionarios = await consulta;
        res.status(200).json(funcionarios);
    }
    catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
};
exports.ObterTodosFuncionarios = ObterTodosFuncionarios;
const ObterFuncionarioPorCPF = async (req, res) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`cpf` = '" + req.params.cpf + "')";
        const consulta = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
        const funcionarios = await consulta;
        res.status(200).json(funcionarios);
    }
    catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
    res.status(200).json(`obtido ${req.params?.id}`);
};
exports.ObterFuncionarioPorCPF = ObterFuncionarioPorCPF;
const CadastrarFuncionario = async (req, res) => {
    const query = "INSERT INTO `serverless`.`funcionario` (`cpf`, `nome`, `idade`, `email`, `salario`, `cargo`) VALUES ('" + req.body.cpf + "', '" + req.body.nome + "', '" + req.body.idade + "', '" + req.body.email + "', '" + req.body.salario + "', '" + req.body.cargo + "');";
    res.status(200).json(req.body);
};
exports.CadastrarFuncionario = CadastrarFuncionario;
const AtualizarFuncionario = async (req, res) => {
    const query = "UPDATE `serverless`.`funcionario` SET `cpf` = '13241234', `nome` = 'asfdf', `email` = 'sdfasdfa', `salario` = '1234', `cargo` = 'teste', `isActived` = '10' WHERE (`cpf` = '19225082762');";
    res.status(200).json({
        message: "atualizado",
        data: req.body,
    });
};
exports.AtualizarFuncionario = AtualizarFuncionario;
const ExcluirFuncionario = async (req, res) => {
    const query = "DELETE FROM `serverless`.`funcionario` WHERE (`cpf` = '19225082762');";
    res.status(200).json(`deleted ${req.params?.id}`);
};
exports.ExcluirFuncionario = ExcluirFuncionario;
//# sourceMappingURL=funcionario.service.js.map