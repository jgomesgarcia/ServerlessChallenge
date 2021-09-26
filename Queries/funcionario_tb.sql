CREATE TABLE funcionario (
	cpf varchar(11) not null,
    nome varchar(50) not null,
    idade int not null,
    email varchar(50) not null,
	salario decimal(8,2) not null default 1000.50,
    cargo varchar (50) not null default 'colaborador',
    isActived boolean default true,
    PRIMARY KEY (cpf)
)