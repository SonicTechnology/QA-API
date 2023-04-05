
create table questions (
  id serial primary key,
  product_id integer not null,
  question_body varchar(100) not null,
  asker_name varchar(30) not null,
  question_helpfulness integer not null default '0',
  reported boolean not null default 'false',
  answers_id integer
);

create table answers (
  id serial primary key,
  questions_id integer references questions(id),
  body varchar(100) not null,
  date timestamp not null,
  answerer_name varchar(30) not null,
  helpfulness integer not null default '0',
  photos json
);

