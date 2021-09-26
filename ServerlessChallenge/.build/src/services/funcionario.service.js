"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcluirFuncionario = exports.AtualizarFuncionario = exports.CadastrarFuncionario = exports.ObterFuncionarioPorCPF = exports.ObterTodosFuncionarios = void 0;
const mysql_1 = __importDefault(require("mysql"));
const EscapeQueryObject_1 = __importDefault(require("../utils/EscapeQueryObject"));
const connection = mysql_1.default.createConnection({
    host: process.env?.DB_HOST,
    user: process.env?.DB_USER,
    password: process.env?.DB_PASSWORD,
    database: process.env?.DB_DATABASE_TABLE,
    port: process.env?.DB_Port ? Number(process.env?.DB_Port) : 3306
});
const regex = {
    cpf: /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/,
    nome: /^[a-záàâãéèêíïóôõöúçñ ]+$/i,
    idade: /^\b[0-9]+$/,
    salario: /(^\d+$)|(^\b[0-9]+\,\d{2}$)/,
    cargo: /^[a-záàâãéèêíïóôõöúçñ ]+$/i,
    email: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i
};
const ObterTodosFuncionarios = async (req, res) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`isActived` = 1)";
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
        const params = (0, EscapeQueryObject_1.default)(req.params);
        if (!regex.cpf.test(params?.cpf))
            return res.status(400).json({ errors: ["CPF inválido."] });
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`cpf` = '" + params?.cpf + "' AND  `isActived` = 1)";
        const consulta = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
        const funcionarios = await consulta;
        res.status(200).json(funcionarios[0]);
    }
    catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
};
exports.ObterFuncionarioPorCPF = ObterFuncionarioPorCPF;
const CadastrarFuncionario = async (req, res) => {
    try {
        const body = (0, EscapeQueryObject_1.default)(req.body);
        let errors = [];
        if (!regex.cpf.test(body?.cpf))
            errors = [...errors, "CPF inválido."];
        if (!regex.nome.test(body?.nome))
            errors = [...errors, "Nome inválido."];
        if (!(typeof body?.idade === 'number'))
            errors = [...errors, "'idade' inválida."];
        else if (body?.idade > 16)
            errors = [...errors, "O funcionário precisa ter mais de 18 anos."];
        if (!regex.email.test(body?.email))
            errors = [...errors, "Email inválido."];
        if (!regex.cargo.test(body?.cargo))
            errors = [...errors, "Cargo inválido"];
        if (!(typeof body?.salario === 'number'))
            errors = [...errors, "'salario' não é um número "];
        else if (body?.salario > 15000)
            errors = [...errors, "O salário não pode ser maior que 15000"];
        if (errors?.length > 0)
            return res.status(400).json({ messages: errors });
        const query = "INSERT INTO `serverless`.`funcionario` (`cpf`, `nome`, `idade`, `email`, `salario`, `cargo`) VALUES ('" + body.cpf + "', '" + body.nome + "', '" + body.idade + "', '" + body.email + "', '" + body.salario + "', '" + body.cargo + "');";
        res.status(200).send(query);
        const consulta = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
        const funcionario = await consulta;
        res.status(200).json(funcionario);
    }
    catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
};
exports.CadastrarFuncionario = CadastrarFuncionario;
const AtualizarFuncionario = async (req, res) => {
    try {
        const body = (0, EscapeQueryObject_1.default)(req.body);
        const params = (0, EscapeQueryObject_1.default)(req.params);
        let errors = [];
        if (!regex.cpf.test(params?.cpf))
            errors = [...errors, "CPF inválido."];
        else if (!params?.cpf && !regex.cpf.test(body?.cpf))
            errors = [...errors, "CPF inválido."];
        if (!regex.nome.test(body?.nome))
            errors = [...errors, "Nome inválido."];
        if (!(typeof body?.idade === 'number'))
            errors = [...errors, "'idade' inválida."];
        else if (body?.idade > 16)
            errors = [...errors, "O funcionário precisa ter mais de 18 anos."];
        if (!regex.email.test(body?.email))
            errors = [...errors, "Email inválido."];
        if (!regex.cargo.test(body?.cargo))
            errors = [...errors, "Cargo inválido"];
        if (!(typeof body?.salario === 'number'))
            errors = [...errors, "'salario' não é um número "];
        else if (body?.salario > 15000)
            errors = [...errors, "O salário não pode ser maior que 15000"];
        if (errors?.length > 0)
            return res.status(400).json({ messages: errors });
        const query = "UPDATE `serverless`.`funcionario` SET `nome` = '" + body?.nome + "', `email` = '" + body?.email + "', `idade` = '" + body?.idade + "', `salario` = '" + body?.salario + "', `cargo` = '" + body?.cargo + "' WHERE (`cpf` = '" + (params.cpf ?? body?.cpf) + "' AND  `isActived` = 1);";
        const consulta = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
        const funcionario = await consulta;
        res.status(200).json(funcionario);
    }
    catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
};
exports.AtualizarFuncionario = AtualizarFuncionario;
const ExcluirFuncionario = async (req, res) => {
    const params = (0, EscapeQueryObject_1.default)(req.params);
    if (!regex.cpf.test(params?.cpf))
        return res.status(400).json({ errors: ["CPF inválido."] });
    const query = "UPDATE `serverless`.`funcionario` SET `isActived` = '1' WHERE (`cpf` = '" + params.cpf + "' AND  `isActived` = 1);";
    try {
        const consulta = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else
                    resolve(results);
            });
        });
        const funcionario = await consulta;
        res.status(200).json("Apagado Sucesso");
    }
    catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
    res.status(200).json(`deleted ${params?.cpf}`);
};
exports.ExcluirFuncionario = ExcluirFuncionario;
//# sourceMappingURL=funcionario.service.js.map