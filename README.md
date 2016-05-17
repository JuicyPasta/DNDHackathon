# Mustang Marks
An enhanced PolyRatings view, complete with Chrome Extension that plugs into PASS

![Mustang Marks demo](docs/demo.gif)

Hackathon project. Search for a teacher (or a class like CPE 357) and you get their PolyRatings numbers, what grades people got, and a word cloud made out of all their reviews. The extension does the same thing inside PASS: click a section and the teacher's card shows up right under it.

PolyRatings moved to polyratings.dev since we made this, so the old .phtml scraping is dead. It uses their public API now and caches everything in `data/cache`. If it can't reach them it falls back to `data/sample.json`, which is just the teachers on the demo page.

## Running it
Needs Node 20+. Redis is optional, it only caches the cards.

```
npm install
redis-server --daemonize yes   # optional
npm start
```

Then go to http://localhost:3000. `PORT` and `REDIS_URL` (default `redis://127.0.0.1:6379`) change where things are, and `OFFLINE=1 npm start` never touches the network.

The server grabs a teacher's reviews the first time someone asks for them. To pull a whole department ahead of time (one request every half second, so it's not hammering anybody):

```
npm run scrape -- CSC CPE
npm run clouds -- CSC CPE
```

## The extension
1. chrome://extensions, turn on developer mode, Load unpacked, pick the `extension` folder
2. it talks to http://localhost:3000, change that in the extension's options if your server is somewhere else
3. go to PASS and click on a section

PASS needs a Cal Poly login, so there's a fake one at http://localhost:3000/demo/pass.html to try it on. That's what's in the gif.

## Notes
- mode and std dev are gone from the cards, PolyRatings only keeps the averages for old reviews now
- teacher photos go in `photos/` as LastFirst.jpg. we only ever got 7 of them
- the extension is Manifest V3 now, so lookups go through a background worker instead of the content script

## Who
- Jackson Darrow ([JuicyPasta](https://github.com/JuicyPasta))
- Devon Grove ([djgrove](https://github.com/djgrove))
- Matt Goodrich ([mrgoodrich](https://github.com/mrgoodrich))
- Kyle Rosenthal ([km3r](https://github.com/km3r))
