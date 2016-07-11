module.exports = function () {
    var route = require('express').Router();
    var conn = require('../db/db')();

    //noinspection JSUnresolvedFunction
    route.post('/add', function (req, res) {
        var sub = req.body.sub;
        //noinspection JSUnresolvedVariable
        var des = req.body.des;
        //noinspection JSUnresolvedVariable
        var author = req.body.author;
        var sql = 'insert into topic_test(sub, des, author) values(?, ?, ?)';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, [sub, des, author], function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            else {
                res.redirect('/index/'+rows.insertId);
            }
        });
    });

    route.get('/add', function (req, res) {
        var sql = 'select * from topic_test';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, function (err, results, fields) {
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('./topic/add', {results: results});
        });
    });

    //noinspection JSUnresolvedFunction
    route.post(['/:id/edit'], function (req, res) {
        var sub = req.body.sub;
        //noinspection JSUnresolvedVariable
        var des = req.body.des;
        //noinspection JSUnresolvedVariable
        var author = req.body.author;
        var id = req.params.id;
        var sql = 'update topic_test set sub=?, des=?, author=? where id=?';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, [sub, des, author, id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            else {
                res.redirect('/index/'+id);
            }
        });
    });

    route.get('/:id/edit', function (req, res) {
        var id = req.params.id;
        var sql = 'select * from topic_test where id = ?';
        if(id){
            //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
            conn.query(sql, [id], function (err, result, fields) {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    res.render('./topic/edit', {result: result[0], id: id});
                }
            });
        }
        else {
            res.send('no record');
        }
    });

    //noinspection JSUnresolvedFunction
    route.post('/:id/delete', function (req, res) {
        var id =req.params.id;
        var sql = 'delete from topic_test where id = ?';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, function (err, results, fields) {
            if(id){
                //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
                conn.query(sql, [id], function (err, result, fields) {
                    if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
                    else {
                        res.redirect('/index');
                    }
                });
            }
            else {
                res.send('no record');
            }
        });
    });

    route.get('/:id/delete', function (req, res) {
        var id = req.params.id;
        var sql = 'select * from topic_test';
        //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
        conn.query(sql, function (err, results, fields) {
            if(id){
                var sql = 'select * from topic_test where id = ?';
                //noinspection JSUnresolvedFunction,JSUnusedLocalSymbols
                conn.query(sql, [id], function (err, result, fields) {
                    if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
                    else {
                        res.render('./topic/delete', {results: results, result: result[0], id: id});
                    }
                });
            }
            else {
                res.send('no record');
            }
        });
    });

    return route;
};