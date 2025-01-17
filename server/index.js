const fs = require('fs');
const path = require('path');

const nconf = require('nconf');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');

require('./initialize');
require('./db');

const { getPublicUser } = require('./models/User.model');
const { authenticatedRoute, jwtAuthentication } = require('./middleware');

////////////////////////////////////
// EXPRESS CONFIG /////////////////
//////////////////////////////////
const app = express();

const rootDir = path.join(__dirname, '../');

app.set('port', nconf.get('PORT') || 3005);

app.use(passport.initialize());
app.use(compression());

require('./config/passport')(passport);

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// This middleware looks for an `Authentication` header, and turns it into
// a User object (stored on req.user).
app.use(jwtAuthentication);

const api = express.Router();

////////////////////////////////////
// ROUTES /////////////////////////
//////////////////////////////////
api.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

api.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // On localhost, this API runs on port 3005.
    // The actual dev webserver is on 3000, though.
    // Because of that, I can't simply set a cookie to pass the login token
    // to the client :/
    const { token } = req.user;

    // Make it a 5-year cookie
    const cookieExpirationDate = new Date(
      Date.now() + 2 * 365 * 24 * 60 * 60 * 1000
    );

    res.cookie(nconf.get('AUTH_TOKEN_KEY'), token, {
      expires: cookieExpirationDate,
    });

    return res.redirect('/');
  }
);

api.get('/users/me', authenticatedRoute, (req, res, next) => {
  return res.json(req.user.getPublic());
});

api.post('/shows/create', authenticatedRoute, (req, res, next) => {
  req.user.addShows(req.body.shows, (err, user) => {
    const shows = user.trackedShows
      .filter((show) => req.body.shows.find(({ id }) => id === show._id))
      .map((show) => show.getPublic());

    return res.json({ shows });
  });
});

api.put('/shows/:showId', authenticatedRoute, (req, res) => {
  req.user.updateShow(
    { showId: req.params.showId, fields: req.body },
    (err, user) => {
      if (err) console.error(err);
      const newShow = user.trackedShows
        .filter((tShow) => tShow._id == req.params.showId)
        .map((show) => show.getPublic())[0];
      res.json(newShow);
    }
  );
});

api.patch('/shows/:showId/episodes', authenticatedRoute, (req, res, next) => {
  const { markAs, episodeIds } = req.body;

  // Convert our URL param back to a number.
  const showId = Number(req.params.showId);

  req.user.toggleEpisodes({ markAs, showId, episodeIds }, (err, result) => {
    if (err) {
      return next(err);
    }

    return res.json({ ok: true });
  });
});

api.delete('/shows/:showId', authenticatedRoute, (req, res, next) => {
  // Convert our URL param back to a number.
  const showId = Number(req.params.showId);

  req.user.deleteShow({ showId }, (err, result) => {
    if (err) {
      return next(err);
    }

    return res.json({ showId });
  });
});

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'build')));
}

api.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.use('/api', api);

////////////////////////////////////
// GOGOGO /////////////////////////
//////////////////////////////////
app.listen(nconf.get('PORT'), () => {
  console.info(`==> 🌎  Listening on port ${nconf.get('PORT')}.`);
  console.info(`Running in ${process.env.NODE_ENV}`);
});
