const urlShortener = require('./urlShortener');

var route = function(app) {
    app.post('/encurtador', function(req, res) {
        urlShortener.addUrl(req.body.url, req, res);
    }),
    app.get('/:hash', (req, res) => {
        urlShortener.getUrl(req.params.hash, req, res);
    });
}

exports.route = route
