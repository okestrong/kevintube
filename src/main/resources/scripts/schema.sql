-- drop table if exists users cascade;
-- drop sequence if exists users_id_seq;
create sequence if not exists users_id_seq;
create table if not exists users
(
    id             bigint  default nextval('users_id_seq'::regclass) not null
        constraint users_pk
            primary key,
    username       varchar(50)                                       not null
        constraint users_uk_username
            unique,
    password       varchar(100)                                      not null,
    email          varchar(200)                                      not null
        constraint users_uk_email
            unique,
    phone          varchar(12),
    name           varchar(50)                                       not null,
    role           varchar(10)                                       not null,
    islogin        boolean default false                             not null,
    isdelete       boolean default false                             not null,
    avatar         varchar(200)
);

-- drop table if exists comments cascade;
-- drop sequence if exists comments_id_seq;
create sequence if not exists comments_id_seq;
create table if not exists comments
(
    id         bigint    default nextval('comments_id_seq'::regclass) not null
        constraint comments_pk
            primary key,
    user_id    bigint                                                 not null
        constraint fk_comments_userid
            references users,
    content    text                                                   not null,
    created_at timestamp default CURRENT_TIMESTAMP                    not null,
    updated_at timestamp,
    deleted_at timestamp,
    isdelete   boolean   default false                                not null,
    ref        bigint                                                 not null,
    child_cnt  integer   default 0                                    not null,
    lev        smallint  default 0                                    not null,
    step       int       default 0                                    not null,
    video_id  varchar(50)                                            not null
);
comment on column comments.ref is '대댓글 트리의 root(최초댓글) id';
comment on column comments.child_cnt is '트리상에서 현재 댓글의 하위((바로 하위레벨만 의미하는게 아님)에 있는 모든 대댓글 갯수';
comment on column comments.lev is '들여쓰기의 기준 (좌측 margin크기를 결정)';
comment on column comments.step is 'ref 트리상에서 level 관계없이 위에서부터 순서';