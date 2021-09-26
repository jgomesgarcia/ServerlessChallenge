import { Request, Response } from 'express';
import mysql from 'mysql';
import IFuncionario from '../interfaces/funcionario';
import EscapeQueryObject from '../utils/EscapeQueryObject';

const connection = mysql.createConnection({
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
}

export const ObterTodosFuncionarios = async (req: Request, res: Response) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`isActived` = 1)";
        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else resolve(results);
            })
        })

        const funcionarios = await consulta;

        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const ObterFuncionarioPorCPF = async (req: Request<{ cpf: string }>, res: Response) => {
    try {
        const params = EscapeQueryObject(req.params) as { cpf: string };
        
        if (!regex.cpf.test(params?.cpf))
        return res.status(400).json({ errors: ["CPF inválido."] });

        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`cpf` = '" + params?.cpf + "' AND  `isActived` = 1)";
        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else resolve(results);
            })
        });

        const funcionarios = await consulta;

        res.status(200).json(funcionarios[0]);
    } catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const CadastrarFuncionario = async (req: Request<any, any, IFuncionario>, res: Response) => {
    try {
        const body = EscapeQueryObject(req.body) as IFuncionario
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
        
        res.status(200).send(query)
        
        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else resolve(results);
            })
        });

        const funcionario = await consulta;

        res.status(200).json(funcionario);
    } catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const AtualizarFuncionario = async (req: Request<{ cpf: string }, any, IFuncionario>, res: Response) => {
    try {
        const body = EscapeQueryObject(req.body) as IFuncionario;
        const params = EscapeQueryObject(req.params) as { cpf: string }
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

        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else resolve(results);
            })
        });

        const funcionario = await consulta;

        res.status(200).json(funcionario);
    } catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const ExcluirFuncionario = async (req: Request<{ cpf: string }>, res: Response) => {
    const params = EscapeQueryObject(req.params) as { cpf: string }
    
    if (!regex.cpf.test(params?.cpf))
       return res.status(400).json({ errors: ["CPF inválido."] });

    const query = "UPDATE `serverless`.`funcionario` SET `isActived` = '1' WHERE (`cpf` = '" + params.cpf + "' AND  `isActived` = 1);";
    try {
        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err)
                    reject(err);
                else resolve(results);
            })
        });

        const funcionario = await consulta;

        res.status(200).json("Apagado Sucesso");
    } catch (error) {
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
    res.status(200).json(`deleted ${params?.cpf}`)
}