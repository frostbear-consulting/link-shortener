CREATE TABLE "user"
(
    "idUser"    serial primary key,
    "name"      varchar(255) not null unique,
    "firstName" varchar(255) not null,
    "lastName"  varchar(255) not null,
    email       varchar(255) not null unique,
    password    varchar(128) not null -- SHA512 length
);

CREATE TABLE session
(
    "idSession" serial primary key,
    token       varchar(64) not null unique,
    user_id     int references "user" ("idUser"),
    "expiresAt" bigint      not null
);

CREATE TABLE advertisement
(
    "idAdvertisement" serial primary key,
    name              varchar(80) not null,
    type              varchar(20) not null,
    content           text        not null,
    user_id           int         not null references "user" ("idUser")
);

CREATE TABLE link
(
    "idLink"       serial primary key,
    "originalLink" varchar(2048) not null UNIQUE,
    token          varchar(20)   not null,
    user_id        int           not null references "user" ("idUser"),
    clicks         bigint        not null default 0
);

CREATE TABLE link_advertisement
(
    link_id          int not null references link ("idLink"),
    advertisement_id int not null references advertisement ("idAdvertisement")
);
