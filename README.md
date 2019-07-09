# bookmarks-server
Assignment for Module 20 - Checkpoint 10

ExpressJS server for the bookmarks client from the React module

## Endpoints
Note: All endpoints require bearer authorization with an API key and return JSON

**GET /bookmarks**

_Returns a list of all the bookmarks_
* Successs: Returns 200 and and all bookmarks in JSON format.
* Failure: Returns 400 on failure with a JSON error message.

**GET /bookmarks/:id**

_Returns the single bookmark for the given ID_
* Successs: Returns 200 with the requested bookmark in JSON format.
* Failure: Returns 404 on failure with a JSON error message.

**POST /bookmarks**

_Accepts a JSON object representing a bookmark for addition to the bookmarks_
* Successs: Returns 201 with a location header supplying the URL of new bookmark.
* Failure: Returns 400 on failure with a JSON error message.

**DELETE /bookmarks/:id**

_Deletes the bookmark with the given ID_
* Successs: Returns 204 and no body.
* Failure: Returns 404 on failure with a JSON error message.
