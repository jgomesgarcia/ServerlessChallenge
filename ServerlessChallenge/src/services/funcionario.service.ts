import { Request, Response } from 'express';
import mysql from 'mysql'
import IFuncionario from '../interfaces/funcionario';

const connection = mysql.createConnection({
    host: process.env?.DB_HOST,
    user: process.env?.DB_USER,
    password: process.env?.DB_PASSWORD,
    database: process.env?.DB_DATABASE_TABLE,
    port: process.env?.DB_Port ? Number(process.env?.DB_Port) : 3306 
})

export const ObterTodosFuncionarios = async (req : Request, res: Response) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario";
        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if(err)
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
export const ObterFuncionarioPorCPF = async (req : Request<{cpf: string}>, res: Response) => {
    try {
        const query = "SELECT cpf, nome, idade, email, salario, cargo FROM serverless.funcionario WHERE (`cpf` = '"+ req.params.cpf +"')";
        const consulta = new Promise<IFuncionario>((resolve, reject) => {
            connection.query(query, (err, results) => {
                if(err)
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
    res.status(200).json(`obtido ${req.params?.cpf}`);
}
export const CadastrarFuncionario = async (req : Request<any,any, IFuncionario>, res: Response) => {
    const query = "INSERT INTO `serverless`.`funcionario` (`cpf`, `nome`, `idade`, `email`, `salario`, `cargo`) VALUES ('"+ req.body.cpf +"', '"+ req.body.nome +"', '"+ req.body.idade +"', '"+ req.body.email +"', '"+ req.body.salario +"', '"+ req.body.cargo +"');";
    res.status(200).json(req.body)
}
export const AtualizarFuncionario = async (req: Request<{cpf: string},any, IFuncionario>, res: Response) => {
    const query = "UPDATE `serverless`.`funcionario` SET `nome` = 'asfdf', `email` = 'sdfasdfa', `salario` = '1234', `cargo` = 'teste', `isActived` = '10' WHERE (`cpf` = '"+ req.params.cpf +"');";
    res.status(200).json({
        message: "atualizado",
        data: req.body,
    })
}
export const ExcluirFuncionario = async (req: Request<{cpf: string}>, res: Response) => {
    const query = "DELETE FROM `serverless`.`funcionario` WHERE (`cpf` = '"+ req.params.cpf +"');";
    res.status(200).json(`deleted ${req.params?.cpf}`)
}