import axios from "axios";
import IFuncionario from "../interfaces/funcionario";

const api = axios.create({ baseURL: "http://localhost:3000/dev" })

function NumeroAleatorio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const funcionario: IFuncionario = {
    cpf: NumeroAleatorio(10000000000, 99999999999)?.toString(),
    idade: NumeroAleatorio(16, 99),
    nome: `Funcionário`,
    cargo: "Colaborador",
    email: `email.${NumeroAleatorio(100, 999)}${NumeroAleatorio(10000, 99999)}@exemplo.com.br`,
    salario: 2500
}

const funcionarioError: IFuncionario = {
    cpf: "342",
    idade: 0,
    nome: "1",
    cargo: "@",
    email: "",
    salario: 10000000
}
describe("Teste  da Rotas de Funcionario", () => {
    it("POST /funcionario/create - Status: 200", async () => {
        const response = await api.post("/funcionario/create", funcionario)
        expect(response.status).toEqual(200);

        expect(response.data.cpf).toEqual(funcionario.cpf);
        expect(response.data.idade).toEqual(funcionario.idade);
        expect(response.data.nome).toEqual(funcionario.nome);
        expect(response.data.cargo).toEqual(funcionario.cargo);
        expect(response.data.email).toEqual(funcionario.email);
        expect(response.data.salario).toEqual(funcionario.salario);
    });
    it("GET /funcionario - Caso: 200", async () => {
        const response = await api.get("/funcionario");

        expect(response.status).toEqual(200);
        expect(response.data?.length).toBeGreaterThanOrEqual(1);
    });

    it("GET /funcionario/{cpf} - Caso: 200", async () => {
        const response = await api.get(`/funcionario/${funcionario.cpf}`);

        expect(response.status).toEqual(200);

    });


    it("UPDATE /funcionario/update/{cpf} - Caso: 200", async () => {
        const response = await api.put(`/funcionario/update/${funcionario.cpf}`, funcionario);

        expect(response.status).toEqual(200);
    });


    it("DELETE /funcionario/delete/{cpf} - Caso: 200", async () => {
        const response = await api.delete(`/funcionario/delete/${funcionario.cpf}`);
        expect(response.status).toEqual(200);
    });

});

