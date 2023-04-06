
create table questions (
  id integer primary key,
  product_id integer not null,
  body varchar(100) not null,
  date_written integer not null,
  asker_name varchar(30) not null,
  asker_email varchar(50) not null,
  helpful integer not null default '0',
  reported boolean not null default 'false',
  answers json
);

create table answers (
  id serial primary key,
  questions_id integer references questions(id),
  body varchar(100) not null,
  date_written timestamp not null,
  answerer_name varchar(30) not null,
  answerer_email varchar(50) not null,
  reported boolean not null default 'false',
  helpful integer not null default '0',
  photos json
);

