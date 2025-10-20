TRUNCATE TABLE empresa RESTART IDENTITY CASCADE;
TRUNCATE TABLE aluno RESTART IDENTITY CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO empresa (nome, login, senha_hash) VALUES
('Concert Tech', 'contato@concert.com.br',   crypt('Empresa#2025',    gen_salt('bf', 12))),
('Finesse Sportz', 'admin@finessesportz.com', crypt('Admin1234',       gen_salt('bf', 12))),
('Velvet Venture', 'hello@velvetventure.com', crypt('V3nture$ecure',   gen_salt('bf', 12))),
('Imagery Lab', 'imagery@concert.com.br',     crypt('Imagery2025*',    gen_salt('bf', 12))),
('Concert Space', 'space@concert.com.br',     crypt('SpaceLaunch#1',   gen_salt('bf', 12)));

INSERT INTO public.aluno (nome, email, senha_hash, saldo) VALUES
('Ana Souza',        'ana.souza@email.com',        crypt('Ana#2025!',      gen_salt('bf', 12)),  120.50),
('Bruno Almeida',    'bruno.almeida@email.com',   crypt('BrunoPass!9',    gen_salt('bf', 12)),   0.00),
('Carla Mendes',     'carla.mendes@email.com',    crypt('C@rla2025',      gen_salt('bf', 12)),  45.00),
('Diego Pereira',    'diego.pereira@email.com',   crypt('Diego_secure1',  gen_salt('bf', 12)),  300.25),
('Elisa Carvalho',   'elisa.carvalho@email.com',  crypt('Elisa!#11',      gen_salt('bf', 12)),   10.75),
('Felipe Rocha',     'felipe.rocha@email.com',    crypt('F3lipe$ecure',   gen_salt('bf', 12)),   78.90),
('Gabriela Santos',  'gabriela.santos@email.com', crypt('GabiSenha2025',   gen_salt('bf', 12)), 1500.00),
('Henrique Lima',    'henrique.lima@email.com',   crypt('Henriq#L12',      gen_salt('bf', 12)),  250.00);
