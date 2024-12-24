-- Atenção: Por apenas o necessário que não impacte os testes.

-- Usuário para mock (não alterar)
insert into "user" (id, created_at, updated_at, deleted_at, name, email, password, role, pending_issues)
values ('0d6e7a61-05d9-4c5f-84f6-40919f754d56', now(), now(), null, '', '', '', '', '');
