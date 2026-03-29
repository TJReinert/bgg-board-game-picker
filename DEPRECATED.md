# ⚠️ This project is deprecated

**BoardGameGeek deprecated anonymous access to their XML API2 in October 2025**, requiring all requests to include a Bearer token. As this is a client-side app with no backend, there is no safe way to include an API token without exposing it publicly.

This repository has been archived. No further development will occur.

## What broke

The BGG XML API2 (`https://boardgamegeek.com/xmlapi2/collection`) now returns `401 Unauthorized` for unauthenticated requests.

## References

- [BGG API2 documentation](https://www.postman.com/1toddlewis/boardgamegeek/documentation/9czdvgo/bgg-xml-api2)
- [GitHub issue #3](https://github.com/TJReinert/bgg-board-game-picker/issues/3)
