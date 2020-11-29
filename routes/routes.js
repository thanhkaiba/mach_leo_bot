
const mc = require('../memcachier');

const appRouter = (app, fs) => {
    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (req, res) => {
        mc.get(req.query.roomId, function(err, val) {
            if(err != null) {
                res.send(' Error');
            }
            else {
                if (val != null) {
                    res.send(val);
                } else {
                    res.send('not found');
                }
            }
        })
    });

    app.post('/', (req, res) => {

        mc.set(req.body.roomId, JSON.stringify(req.body.data), {expires:60 * 60 * 24}, function(err, val) {
            if(err != null) {
                console.log('Error setting value: ' + err);
                res.send('Error setting value');
            } else {
                res.send('Success');
            }
        });
    });

};

// this line is unchanged
module.exports = appRouter;
