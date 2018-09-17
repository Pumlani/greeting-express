create table greeteduser(
	id serial not null primary key,
	Username text not null,
    counter int default 0
);