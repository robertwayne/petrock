# [PetRock.gg](https://petrock.gg)

### This is a work in progress. Code is a bit messy and there will be a lot of refactoring

Leaderboard analytics & game database for [https://retro-mmo.com](https://retro-mmo.com). See various
current and historical data points such as:

- Current standings with latest player movement (increasess/decreases)
- Experience gains per day/week/month
- Highest historial movement amounts
- Quick view how much until next place

## TODO
- Fix type defs
- Clean up the CSS in the Svelte files (Leaderboard, Nav)
- Set up database weekly/monthly functionality (and reset daily w/ server reboots)
- Add in general database functionality (items, mobs, zones, etc.)
- Add search

## Tech Stack
**Project & Build:** Yarn, Lerna, Snowpack, Prettier

**Client:** TypeScript w/ Svelte

**Server:** TypeScript w/ Node (Fastify)

**Update Service:** TypeScript w/ Node

**Database:** Postgres
