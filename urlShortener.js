const config = require('./config');
const mysql = require('mysql');
const hashGenerator = require('./hashGenerator');
const moment = require('moment');

const ERROR_CODE_SERVER = 500;
const ERROR_CODE_URL_EXPIRED = 400;
const ERROR_CODE_URL_NOT_FOUND = 404;

const EXPIRE_VALUE = 1;
const EXPIRE_TYPE = 'minutes';

var pool = mysql.createPool({
    host:config.DB_HOST,
    user:config.DB_USER,
    password:config.DB_PASSWORD,
    database:config.DB_NAME
});

function replaceAll(str, mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}

function getInsertQuery(con, url, hash, datetime_expired) {
    var query = 'INSERT INTO url VALUES (NULL, {url}, {hash}, {datetime_expired}, NULL)';
    return replaceAll(query, {
        "{url}": con.escape(url),
        "{hash}": con.escape(hash),
        "{datetime_expired}": con.escape(datetime_expired)
    });
}

function getSelectQuery(con, hash) {
    var query = 'SELECT url, datetime_expired FROM url WHERE hash = {hash} LIMIT 1';
    return replaceAll(query, {"{hash}": con.escape(hash)});
}

function isExpired(datetime) {
    datetime = moment(datetime);
    return moment() > datetime;
}

var addUrl = function(url, req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            res.status(ERROR_CODE_SERVER).send({error: 'Error when trying to connect to the database'});
            return;
        }

        var hash = hashGenerator.generate();
        datetime_expired = moment().add(EXPIRE_VALUE, EXPIRE_TYPE).format('YYYY-MM-DD HH:mm:ss');
        con.query(getInsertQuery(con, url, hash, datetime_expired), function(err) {
            if(err) {
                res.status(ERROR_CODE_SERVER).send({error: 'Error when trying to persist the URL in the database'});
                return;
            }

            res.send({newUrl: req.protocol + '://' + req.get('Host') + '/' + hash});
        });
        con.release();
    });
};

var getUrl = function(hash, req, res) {
    pool.getConnection(function(err, con) {
        if (err) {
            res.status(ERROR_CODE_SERVER).send({error: 'Error when trying to connect to the database'});
            return;
        }

        con.query(getSelectQuery(con, hash), function(err, rows) {
            if (err) {
                res.status(ERROR_CODE_SERVER).send({error: 'Error when trying to get the URL from the database'});
                return;
            }

            if (!rows.length) {
                res.status(ERROR_CODE_URL_NOT_FOUND).send({error: 'This URL was not found in the database'});
                return;
            }
            if (isExpired(rows[0].datetime_expired)) {
                res.status(ERROR_CODE_URL_EXPIRED).send({error: 'This URL is already expired'});
                return;
            }

            res.redirect(rows[0].url);
        });
    });
};

exports.addUrl = addUrl;
exports.getUrl = getUrl;
