
const mc = require('../memcachier');

const appRouter = (app, fs) => {

    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/today', (req, res) => {
        const now = new Date();
        const dString =  now.getUTCFullYear() + '-' + now.getUTCDate() + '-' + (now.getUTCMonth() + 1);
        mc.get(dString, function(err, val) {
            if(err != null) {
                res.send("Error");
            }
            else {
                if (val != null) {
                    res.send('Today match count: ' + val);
                } else {
                    res.send('Today match count: 0');
                }
            }
        });
    });

    app.get('/date', (req, res) => {
        mc.get(req.query['day'], function(err, val) {
            if(err != null) {
                res.send("Error");
            }
            else {
                if (val != null) {
                    res.send(req.query['day'] + ' total match count: ' + val);
                } else {
                    res.send(req.query['day'] + ' total match count: 0');
                }
            }
        });
    });

    app.post('/bscm', (req, res) => {

        const now = new Date();
        const dString =  now.getUTCFullYear() + '-' + now.getUTCDate() + '-' + (now.getUTCMonth() + 1);
        mc.get(dString, function(err, val) {
            let count = 0;
            if(err == null) {
                if (val != null) {
                    count = count + +val;
                }
            }
            mc.set(dString, '' + (count + 1), {expires: 0}, function(err, val) {
                if(err != null) {
                    console.log('Error setting value: ' + err);
                    res.send('Error setting value');
                } else {
                    res.send('Success');
                }
            });
        });

    });

};

// this line is unchanged
module.exports = appRouter;
