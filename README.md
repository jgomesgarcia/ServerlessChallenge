# ServerlessChallenge

## Descrição
Este é um projeto básico de uma função AWS Lambda que realiza um CRUD de Funcionários em um banco de dados MySQL
## Tecnologias Utilizadas

* Node JS
* TypeScript
* Serverless Framework
* Express
* MySQL
* Jest JS
* Swagger
## Rotas

[Ver rotas no codigo](ServerlessChallenge/src/routes/funcionario.route.ts)

* GET /funcionario

* GET /funcionario/{cpf}
    * parametros: `cpf: string`
    
* POST /funcionario/create
    * Corpo: [IFuncionario](#-funcionario-)

* UPDATE /funcionario/update/{cpf}
    * parametros: `cpf: string`
    * Corpo: [IFuncionario](#-funcionario-)

* DELETE /funcionario/delete/{cpf}
    * parametros: `cpf: string`

## Banco
O banco possui 7 Colunas:
* cpf - varchar(11)
* nome - varchar(50)
* idade - int
* email - varchar(50)
* cargo - decimal(8,2)
* salario - varchar (50)
* isActived - isActived

[Ver string de criação da tabel](ServerlessChallenge/Queries/funcionario_tb.sql)

## Objeto
<h3 href="funcionario"> IFuncionario </h3>
[Ver interface no código](ServerlessChallenge/src/interfaces/funcionario.ts)

~~~
    {
        "cpf": "",
        "nome": "",
        "idade": 0,
        "email": "",
        "cargo": "",
        "salario": 0.0,
    }
~~~

