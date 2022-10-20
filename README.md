# PetRock

**[petrock.gg](https://petrock.gg)**

**[staging.petrock.gg](https://staging.petrock.gg)**

Leaderboard analytics & game database for
**[RetroMMO](https://retro-mmo.com)**. See various current and
historical data points such as:

- Current standings with latest player movement *(increasess/decreases)*
- Experience gains per day/week/month
- Highest historial movement amounts
- Quick view how much until next place

This branch *(dev)* is a WIP rewrite of many Petrock services:

- The `service-runner` is being replaced with **[petrock-ingest](https://github.com/robertwayne/petrock-ingest)**.
- The API server will be replaced with **[petrock-api](https://github.com/robertwayne/petrock/tree/dev/server)**.

This branch is hosted on the **[staging site](https://staging.petrock.gg)**.

## Related

See [retrommo-fetch](https://github.com/robertwayne/retrommo-fetch) for a Rust wrapper around the RetroMMO API.

## License

Petrock source code is dual-licensed under either

- **[MIT License](/docs/LICENSE-MIT)**
- **[Apache License, Version 2.0](/docs/LICENSE-APACHE)**

at your option.
