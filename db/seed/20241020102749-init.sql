-- Senha: abc123
-- $2b$08$Fhia67uYgjGoM0sxlTMQWO0NCUz8GZY/vJ.dWSOIuM8q7d8zhZpMC

-- Usuário Administrador
insert into "user" (id, created_at, updated_at, deleted_at, name, email, password, role)
values ('5e4ec094-f5f2-48af-ab05-e7599917978b', now(), now(), null, 'Caio Leandro João Nascimento',
        'caioleandronascimento@telefonica.com',
        '$2b$08$Fhia67uYgjGoM0sxlTMQWO0NCUz8GZY/vJ.dWSOIuM8q7d8zhZpMC', 'ADMINISTRATOR');

