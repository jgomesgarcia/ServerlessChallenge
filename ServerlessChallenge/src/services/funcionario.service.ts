import { Request, Response } from 'express';
import pool from '../utils/database';
import IFuncionario from '../interfaces/funcionario';

const regex = {
    cpf: /^\d{3}.?\d{3}.?\d{3}-?\d{2}$/,
    nome: /^[a-záàâãéèêíïóôõöúçñ ]+$/i,
    idade: /^\b[0-9]+$/,
    salario: /(^\d+$)|(^\b[0-9]+\,\d{2}$)/,
    cargo: /^[0-9a-záàâãéèêíïóôõöúçñ ]+$/i,
    email: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.([a-z]+))?$/i
}

const ValidarObjetoFuncionario = (funcionario: IFuncionario) => {
    let errors = [];

    if (!regex.cpf.test(funcionario?.cpf))
        errors = [...errors, "CPF inválido."];

    if (!regex.nome.test(funcionario?.nome))
        errors = [...errors, "Nome inválido."];

    if (!(typeof funcionario?.idade === 'number'))
        errors = [...errors, "'idade' inválida."];
    else if (funcionario?.idade < 16)
        errors = [...errors, "O funcionário precisa ter mais de 18 anos."];

    if (!regex.email.test(funcionario?.email))
        errors = [...errors, "Email inválido."];

    if (!regex.cargo.test(funcionario?.cargo))
        errors = [...errors, "Cargo inválido"];

    if (!(typeof funcionario?.salario === 'number'))
        errors = [...errors, "'salario' não é um número "];
    else if (funcionario?.salario > 15000)
        errors = [...errors, "O salário não pode ser maior que 15000"];

    return errors
}

export const ObterTodosFuncionarios = async (req: Request, res: Response) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`isActived` = 1)";
        const consulta = new Promise<any>((resolve, reject) => {
            pool.query(query, (err, results) => {
                if (err)
                    reject(err);
                else resolve(results);
            })
        })

        const funcionarios = await consulta;

        res.status(200).json(funcionarios);
    } catch (error) {
        console.log(error);
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const ObterFuncionarioPorCPF = async (req: Request<{ cpf: string }>, res: Response) => {
    try {
        const params = req.params;

        if (!regex.cpf.test(params?.cpf))
            return res.status(400).json({ errors: ["CPF inválido."] });

        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`cpf` = ? AND `isActived` = 1)";
        const consulta = new Promise<any>((resolve, reject) => {
            pool.query(
                query,
                [params?.cpf],
                (err, results) => {
                    if (err)
                        reject(err);
                    else resolve(results);
                }
            )
        });

        const funcionarios = await consulta;

        res.status(200).json(funcionarios[0]);
    } catch (error) {
        console.log(error);
        res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const CadastrarFuncionario = async (req: Request<any, any, IFuncionario>, res: Response) => {
    try {
        const body = req.body;

        let errors = ValidarObjetoFuncionario(req.body);

        if (errors?.length > 0)
            return res.status(400).json({ messages: errors });

        const query = "INSERT INTO `serverless`.`funcionario` (`cpf`, `nome`, `idade`, `email`, `salario`, `cargo`) VALUES (?, ?, ?, ? , ?, ?);";
        const consulta = new Promise<any>((resolve, reject) => {
            pool.query(
                query,
                [body?.cpf, body?.nome, body?.idade, body?.email, body?.salario, body?.cargo],
                (err, results) => {
                    if (err)
                        reject(err);
                    else resolve(results);
                }
            )
        });

        const funcionario = await consulta;

        return res.status(200).json(body);
    } catch (error) {
        console.log(error);
        return res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const AtualizarFuncionario = async (req: Request<{ cpf: string }, any, IFuncionario>, res: Response) => {
    try {
        const body = req.body
        const params = req.params
        let errors = ValidarObjetoFuncionario({
            ...req?.body,
            cpf: req?.params?.cpf ?? req?.body?.cpf,
        });

        if (errors?.length > 0)
            return res.status(400).json({ messages: errors });

        const query = "UPDATE `serverless`.`funcionario` SET `nome` = ?, `email` = ?, `idade` = ?, `salario` = ?, `cargo` = ? WHERE (`cpf` = ? AND  `isActived` = 1);";
        const consulta = new Promise<any>((resolve, reject) => {
            pool.query(
                query,
                [body?.nome, body?.email, body?.idade, body?.salario, body?.cargo, params?.cpf ?? body?.cpf,],
                (err, results) => {
                    if (err)
                        reject(err);
                    else resolve(results);
                }
            )
        });

        const funcionario = await consulta;

        return res.status(200).json({...body, cpf: params.cpf});
    } catch (error) {
        console.log(error);
        return res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}
export const ExcluirFuncionario = async (req: Request<{ cpf: string }>, res: Response) => {
    try {
        const params = req.params;

        if (!regex.cpf.test(params?.cpf))
            return res.status(400).json({ errors: ["CPF inválido."] });

        const query = "UPDATE `serverless`.`funcionario` SET `isActived` = '0' WHERE (`cpf` = ? AND  `isActived` = 1);";
        const consulta = new Promise<any>((resolve, reject) => {
            pool.query(
                query,
                [params?.cpf],
                (err, results) => {
                    if (err)
                        reject(err);
                    else resolve(results);
                }
            )
        });

        const funcionario = await consulta;
        if(funcionario?.affectedRows === 0)
            return res.status(204)
        return res.status(200).json(funcionario);
    } catch (error) {
        console.log(error);
        return res.status(error?.number ?? 500).json({
            erro: error?.code ?? 'UNKNOWM',
            mensagem: error?.sqlMessage ?? JSON.stringify(error)
        });
    }
}