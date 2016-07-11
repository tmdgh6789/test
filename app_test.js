const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const bodyParser = require('body-parser');

const app = express();

const conn = require('./routes/db/db')();

app.use(bodyParser.urlencoded({ extend: false }));

app.set('views', './views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.get(['/index','/index/:id'], function (req, res) {
    const sql = 'select id, sub from topic_test';
    //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
    conn.query(sql, function (err, rows, fields) {
        const id = req.params.id;
        if (id) {
            const sql = 'select * from topic_test where id=?';
            //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
            conn.query(sql, [id], function (err, row, fields) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('./index', {results: rows, result: row[0], user:req.user});
                }
            });
        }
        else {
            res.render('./index', {results: rows, user:req.user});
        }
    });
});

//noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
app.post('/member/login', function (req, res) {                                                     //login 해야함
    //noinspection JSUnusedLocalSymbols
    const uname = req.body.username;
    //noinspection JSUnusedLocalSymbols
    const pass = req.body.password;
    const sql = 'select * from member where username=?';
    //noinspection JSUnresolvedFunction
    conn.query(sql, uname, function (err, member, fields) {
        if(uname === member.username && pass === member.password){
            req.session.save(function () {
                res.redirect('/index');
            });
        }
        else {
            res.send(member[0] + ' who are you? <a href="/member/login">login</a>');
        }
    });
});

app.get('/member/login', function (req, res) {
    const sql = 'select * from member';
    //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
    conn.query(sql, function (err, results, fields) {
        if(err){
            console.log(err);
        }
        else {
            res.render('./member/login');
        }
    });
});

//noinspection JSUnresolvedFunction,JSUnresolvedVariable,JSUnusedLocalSymbols
app.post('/member/register', function (req, res) {
    //noinspection SpellCheckingInspection
    const user = {
        authId: 'local:'+req.body.username,
        username: req.body.username,
        password: req.body.password,
        salt: '',
        displayName: req.body.displayName,
        email: req.body.email
    };
    const sql = 'insert into member set ?';
    //noinspection JSUnresolvedVariable,JSUnusedLocalSymbols,JSUnresolvedFunction
    conn.query(sql, user, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/index');
        }
    });
});

app.get('/member/register', function (req, res) {
    const sql = 'select * from member';
    //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
    conn.query(sql, function (err, results, fields) {
        if(err){
            console.log(err);
        }
        else {
            res.render('./member/register');
        }
    });
});

const topic = require('./routes/topic/topic')();
app.use('/topic/', topic);

app.listen(3005, function () {
    console.log('Connected 3005 port!');
});