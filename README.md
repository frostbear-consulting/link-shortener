# hsw-shortener-solution

The idea of this repository is to provide a sample implementation of a link shortener, used for educational purposes.

# ER-Model for the database

![](ermodel.png)

# Configuration

There is a simple configuration that is required in order for the application to work. The base can be taken
from `config.js.template`, copied to `config.js` in the root of the project and it will be used.

It consists of a few properties on the top level:

| Name           | Type   | Description                                                                                                                                            |
|----------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| port           | number | The port on which the API will listen                                                                                                                  |
| secret         | string | The secret for the cookie that will be set for the session                                                                                             |
| cookieName     | string | name of the cookie that will be set and loaded for the cookie                                                                                          |
| db_url         | string | database connection string in the format of `postgres://{user}:{password}@{host}:{port}/{database}`                                                    |
| expirationTime | number | Number of milliseconds after which a session should expire. Can use calculations such as 30 * 60 * 1000 for the amount of milliseconds for 30 minutes. |

Sample config:

```js
module.exports = {
    port: 3000,
    secret: 'hsw2022',
    cookieName: 'HSWSESSION2022',
    db_url: 'postgres://user:password@somehost:1234/hswshortener',
    // Token / session expiration time in ms
    expirationTime: 30 * 60 * 1000, // 30 minutes * 60 seconds * 1000 milliseconds
};

```

# Endpoint documentation

When referring to the current user, the token from the header configured in the config will be read to read a session
from the database.

## links as a consumer

### `GET /{token}`

Obtains the link that's associated with a token.

Response (200):

```json
{
  "originalLink": "https://google.com",
  "ads": [
    {
      "idAdvertisement": 1,
      "name": "Ice cream ad",
      "content": "some text for this ad",
      "type": "text"
    }
  ]
}
```

Response (404):

```json
{
  "error": "The provided token is not associated with a link."
}
```

## Session / Registration

### `GET /api/session`

Loads the current session from the API and prolongs the session by another X ms (as per configuration).

If a session is loaded with a token that does not exist, 400 is thrown. If a session is loaded with a token that has
expired, that session is deleted from the database and 400 is thrown.

Any request to any subroute of `/api/` except `/api/login` and `/api/register` requires a session, meaning the
configured token must be configured and valid. Otherwise a 400 response is thrown.

Response (200):

```json
{
  "idUser": 1,
  "firstName": "Rainer",
  "lastName": "Zufall",
  "email": "a@b.com",
  "name": "rainer",
  "expiresAt": "1648986539550"
}
```

Response (403), if the session is expired, invalid or not found (though thrown by the middleware):

```json
{
  "error": "Your session may have expired. Please login to continue."
}
```

### `DELETE /api/session`

Destroys the session of the current user. Requires a current session.

```json
{
  "success": true
}
```

### `POST /api/login`

Logs a user in, creates a new session and sets the session cookie.

Responds with 200 if the login was successful. 404 if not, whether it is due to the user not being found or the password
being invalid is intentionally not leaked to the API consumer.

Request body:

```json
{
  "user": "<name in the database>",
  "password": "<password in plain text>"
}
```

Response (200):

```json
{
  "success": true
}
```

Response (404):

```json
{
  "error": "The user could not be found"
}
```

### `PUT /api/session`

Prolongs the current session. Despite being a PUT request, it does not expect a body. Since it is behind the session
middleware, it assumes the existence of a valid session and only responds `200 OK`.

Response (200)

```json
{
  "success": true
}
```

### `POST /api/register`

Allows a new user to register to the application. The user is automatically logged in after registration. The response
body is the session.

Request body:

```json
{
  "name": "rainer",
  "firstName": "Rainer",
  "lastName": "Zufall",
  "email": "a@b.com",
  "password": "supersafepassword"
}
```

Response (200):

```json
{
  "idUser": 1,
  "firstName": "Rainer",
  "lastName": "Zufall",
  "email": "a@b.com",
  "name": "rainer",
  "expiresAt": "1648986248696"
}
```

## Link maintenance

### `GET /api/links`

Obtains all links for the current user.

Response (200):

```json
[
  {
    "originalLink": "https://.....",
    "token": "defAkpLn1m4N12",
    "user_id": 1,
    "clicks": 24
  },
  {
    "originalLink": "https://.....",
    "token": "pDnfqbF109ER",
    "user_id": 1,
    "clicks": 12
  }
]
```

### `GET /api/links/{id}`

Obtains information for one specific link, including associated advertisements. Throws 400 if the requested link cannot
be found (this includes not being associated to the current user).

Response(200):

```json
{
  "idLink": 1,
  "originalLink": "https://.....",
  "token": "defAkpLn1m4N12",
  "user_id": 1,
  "clicks": 24,
  "ads": [
    {
      "idAdvertisement": 1,
      "name": "Ice cream commercial"
    },
    {
      "idAdvertisement": 2,
      "name": "some other ad"
    }
  ]
}
```

Response (400):

```json
{
  "error": "Invalid link ID provided."
}
```

Response (404):

```json
{
  "error": "The requested link could not be found."
}
```

### `POST /api/links`

Creates a new link.

Request body:

```json
{
  "originalLink": "https://.....",
  "token": "sometoken"
}
```

Response (200):

```json
{
  "idLink": 1,
  "originalLink": "https://....",
  "token": "sometoken",
  "user_id": 1,
  "clicks": 0,
  "ads": []
}
```

Response (412):

```json
{
  "error": "The provided token for the shortened link is already in use."
}
```

### `PUT /api/links/{id}`

Updates a link with a new original link / token. The clicks cannot be reset, and a link cannot be reassigned. Responds
with the updated link if it exists. Responds with 404 if the link does not exist or the ID is not associated with the
current user.

Request body:

```json
{
  "originalLink": "https://.....",
  "token": "sometoken"
}
```

Response (200):

```json
{
  "idLink": 1,
  "originalLink": "https://....",
  "token": "sometoken",
  "user_id": 1,
  "clicks": 0
}
```

Response (400):

```json
{
  "error": "Invalid link ID provided."
}
```

Response (404):

```json
{
  "message": "Could not find the requested link"
}
```

### `PUT /api/links/{id}/ads`

Updates the advertisements that are assigned to a link. Responds with 200 and the updated link if it was successful.
Responds with 404 if the link could not found.

Request body:

```json
{
  "ads": [
    1
  ]
}
```

Response (200):

```json
{
  "idLink": 1,
  "originalLink": "https://.....",
  "token": "defAkpLn1m4N12",
  "user_id": 1,
  "clicks": 24,
  "ads": [
    {
      "idAdvertisement": 1,
      "name": "Ice cream commercial"
    }
  ]
}
```

Response (400):

```json
{
  "error": "Invalid link ID provided."
}
```

Response (404):

```json
{
  "error": "Could not find the requested link to associate ads to"
}
```

### `DELETE /api/links/{id}`

Deletes a link. Throws a 404 if the link could not be found. Responds with 200 if deletion was successful.

Response (200):

```json
{
  "success": true
}
```

Response (400):

```json
{
  "error": "Invalid link ID provided."
}
```

Response (404):

```json
{
  "error": "Could not find the link to delete"
}
```

## Ad maintenance

### `GET /api/advertisements`

Returns all created advertisements for the current user. As of right now, the type is irrelevant. This may be changed to
handle images and text differently. The content is a TEXT field and could therefore contain base64 for an image.

Response (200):

```json
[
  {
    "idAdvertisement": 1,
    "type": "text",
    "content": "some text for this ad",
    "name": "Ice cream ad",
    "user_id": 1
  }
]
```

### `GET /api/advertisements/{id}`

Fetches a specific advertisement. Throws 404 if it could not be found.

Response (200):

```json
{
  "idAdvertisement": 1,
  "type": "text",
  "content": "some text for this ad",
  "name": "Ice cream ad",
  "user_id": 1
}
```

Response (400):

```json
{
  "error": "Invalid advertisement ID provided."
}
```

Response (404):

```json
{
  "error": "Could not find the requested ad"
}
```

### `POST /api/advertisements`

Creates a new advertisement for the current user.

Request body:

```json
{
  "type": "text",
  "content": "some text for this ad",
  "name": "Ice cream ad"
}
```

Response (200):

```json
{
  "idAdvertisement": 1,
  "type": "text",
  "content": "some text for this ad",
  "name": "Ice cream ad",
  "user_id": 1
}
```

### `PUT /api/advertisements/{id}`

Updates an existing advertisement. Throws a 404 if the advertisement to update does not exist or does not belong to the
current user.

Request body:

```json
{
  "type": "text",
  "content": "some text for this ad",
  "name": "Ice cream ad"
}
```

Response (200):

```json
{
  "idAdvertisement": 1,
  "type": "text",
  "content": "some text for this ad",
  "name": "Ice cream ad",
  "user_id": 1
}
```

Response (400):

```json
{
  "error": "Invalid advertisement ID provided."
}
```

Response (404):

```json
{
  "error": "Could not find the requested ad"
}
```

### `DELETE /api/advertisements/{id}`

Deletes an advertisement. Throws a 404 if the advertisement does not exist or does not belong to the current user.

Response (200):

```json
{
  "success": true
}
```

Response (400):

```json
{
  "error": "Invalid advertisement ID provided."
}
```

Response (404)

```json
{
  "error": "Could not find the requested ad"
}
```

Response (412)

```json
{
  "error": "The ad is in use and therefore cannot be deleted until all associations are removed."
}
```