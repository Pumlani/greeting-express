create table greetedUser(
	id serial not null primary key,
	UserName text not null,
    counter int default 0
);