CREATE TABLE IF NOT EXISTS public.aluno
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome text NOT NULL,
    email text NOT NULL,
    senha_hash text NOT NULL,
    cpf bigint,
    rg bigint,
    cep bigint,
    insituicao_id bigint,
    curso_id bigint,
    saldo integer,
    vantagem_id bigint,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.empresa
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    nome text NOT NULL,
    login text NOT NULL,
    senha_hash text NOT NULL,
    vantagem_id bigint,
    PRIMARY KEY (id)
);