# bookmarks-server
Assignment for Module 20 - Checkpoint 10

ExpressJS server for the bookmarks client from the React module

## Endpoints
Note: All endpoints require Bearer authorization with an API key and return JSON

GET /bookmarks

_Returns a list of all the bookmarks_

GET /bookmarks/:id

_Returns the single bookmark for the given ID_

POST /bookmarks

_Accepts a JSON object representing a bookmark for addition to the bookamrks_

DELETE /bookmarks/:id

_Deletes the bookmark with the given ID_
