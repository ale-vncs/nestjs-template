create table "user"
(
    id             varchar(36)  not null,
    created_at     timestamptz  not null,
    updated_at     timestamptz  not null,
    deleted_at     timestamptz,
    name           varchar(255) not null,
    email          varchar(255) not null,
    password       text         not null,
    role           varchar(20)  not null,
    pending_issues text         not null,
    status         varchar(20)  not null default 'ACTIVE',

    constraint pk_user primary key (id),
    constraint uk_user__email unique (email)
);

-- ========================
-- Usuário Administrador
insert into "user" (id, created_at, updated_at, deleted_at, name, email, password, role, pending_issues)
values ('e929ca87-a839-4c8d-95b1-320878260cd8', now(), now(), null, 'Administrador', 'admin@test.com', '$2b$08$Fhia67uYgjGoM0sxlTMQWO0NCUz8GZY/vJ.dWSOIuM8q7d8zhZpMC', 'ADMINISTRATOR', '');
