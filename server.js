const express = require('express');

const server = express();

const session = require('express-session');

const knexSessionStorage = require('connect-session-knex')(session);

const userRouter = require('./user/user-router.js')



const sessionConfiguration = {
    name: 'config',
    secret: process.env.SESSION_SECRET || 'TestSecret',
    cookie: {
        maxAge: 1000 * 60 * 60, 
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new knexSessionStorage({
        clearInterval: 1000 * 60 * 10,
        tablename: 'user_sessions',
        sidfieldname: 'id',
        createtable: true
    })
}


server.use(express.json());

server.use(session(sessionConfiguration));

server.use('/api/', userRouter);

module.exports = server;