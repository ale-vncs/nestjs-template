-- Atenção: Por apenas o necessário que não impacte os testes.

-- Usuário para mock (não alterar)
insert into "user" (id, created_at, updated_at, deleted_at, name, email, password, cpf_cnpj, pending_issues)
values ('0d6e7a61-05d9-4c5f-84f6-40919f754d56', now(), now(), null, '', '', '', '', '');

-- Grupo de Propriedade Associado
insert into "property_group_association" (id, name, created_at, updated_at)
values ('fa9d42cd-16e7-423a-9596-c86a640df19f', 'Associação #1', now(), now());

-- Proprietário #1
insert into "user" (id, created_at, updated_at, deleted_at, name, email, password, cpf_cnpj, pending_issues)
values ('a74d9f09-92e1-463a-af24-728a53ca0f1a', now(), now(), null, 'Isabela Regina Souza',
        'isabela.regina.souza@bluewash.com.br', '$2b$08$Fhia67uYgjGoM0sxlTMQWO0NCUz8GZY/vJ.dWSOIuM8q7d8zhZpMC', '74362891366', '');

insert into "user_role" (user_id, role_name)
values ('a74d9f09-92e1-463a-af24-728a53ca0f1a', 'VENDOR_PERSON');

insert into "vendor_person" (user_id, created_at, updated_at, deleted_at)
values ('a74d9f09-92e1-463a-af24-728a53ca0f1a', now(), now(), null);

insert into "property_owner" (id, name, cpf_cnpj, created_at, updated_at, deleted_at)
values ('d9c55bd7-be74-427c-9e87-74c9bfd4db0c', 'Isabela Regina Souza', '74362891366', now(), now(), null);

-- Grupo de Propriedade #1
insert into "property_group" (id, created_at, updated_at, deleted_at, name, description, property_group_association_id,
                              property_owner_id)
values ('72930f1f-4f3d-4747-b5a6-7b9a62580f19', now(), now(), null, 'Grupo Propriedade #1', '',
        'fa9d42cd-16e7-423a-9596-c86a640df19f', 'd9c55bd7-be74-427c-9e87-74c9bfd4db0c');

-- Grupo de Propriedade #2
insert into "property_group" (id, created_at, updated_at, deleted_at, name, description, property_group_association_id,
                              property_owner_id)
values ('6a376d83-aeb0-490a-882c-5c4bd4cd051e', now(), now(), null, 'Grupo Propriedade #2', '',
        'fa9d42cd-16e7-423a-9596-c86a640df19f', 'd9c55bd7-be74-427c-9e87-74c9bfd4db0c');

insert into "vendor_person_property_group" (vendor_person_id, property_group_id)
values ('a74d9f09-92e1-463a-af24-728a53ca0f1a', '72930f1f-4f3d-4747-b5a6-7b9a62580f19');

insert into "vendor_person_property_group" (vendor_person_id, property_group_id)
values ('a74d9f09-92e1-463a-af24-728a53ca0f1a', '6a376d83-aeb0-490a-882c-5c4bd4cd051e');

-- Plantação #1
insert into "harvest" (id, created_at, updated_at, deleted_at, name)
values ('3814d34b-3146-40f4-8663-f2b97f903020', now(), now(), null, 'Milho');

-- Plantação #2
insert into "harvest" (id, created_at, updated_at, deleted_at, name)
values ('972bebf5-e0aa-47e1-9105-f1001086fe4a', now(), now(), null, 'Soja');

-- Unidade #1
insert into "unit" (id, created_at, updated_at, deleted_at, name, description)
values ('68c4a8c5-cabe-40dd-b219-ccec6a007c13', now(), now(), null, 'Unidade #1', '');
