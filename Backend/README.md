# User Authentication API Documentation

This document explains the user authentication flow implemented in:

- `routes/users.routes.js`
- `controllers/user.controllers.js`
- `services/user.services.js`
- `models/user.models.js`

It also now includes:

- Captain authentication flow (`/captains/*`)
- Backend file-by-file reference for the current project structure

## Backend File Details

This section describes what each backend file currently does.

| File | Purpose |
|---|---|
| `server.js` | Creates the HTTP server from Express app and starts listening on `PORT` (default `3000`). |
| `app.js` | Loads environment variables, connects MongoDB, registers middleware (`json`, `urlencoded`, `cors`, `cookie-parser`), and mounts `/users` and `/captains` routes. |
| `db/db.js` | Connects Mongoose to MongoDB using `process.env.DB_CONNECT`. |
| `routes/users.routes.js` | Defines user routes: register, login, profile, logout; includes request validation and auth middleware on protected endpoints. |
| `controllers/user.controllers.js` | Handles user register/login/profile/logout request logic and response formatting. |
| `services/user.services.js` | User creation service with required-field checks and `User.create(...)`. |
| `models/user.models.js` | User schema and auth helpers: password hashing, password compare, JWT token generation. |
| `routes/captain.routes.js` | Defines captain routes: register, login, profile, logout; includes vehicle validations and captain auth middleware on protected endpoints. |
| `controllers/captain.controller.js` | Handles captain register/login/profile/logout flows including duplicate email check and token handling. |
| `services/captain.services.js` | Captain creation service with required field validation for profile + vehicle fields. |
| `models/captain.models.js` | Captain schema with nested vehicle details and auth helpers: hash, compare, JWT generation. |
| `middleware/auth.middleware.js` | Auth middleware for both users and captains; verifies JWT and rejects blacklisted tokens. |
| `models/blacklistTokens.model.js` | Stores invalidated JWTs (used on logout) with TTL expiry (`24h`). |

## Captain Authentication API Documentation

This section explains the captain authentication flow implemented in:

- `routes/captain.routes.js`
- `controllers/captain.controller.js`
- `services/captain.services.js`
- `models/captain.models.js`

### Endpoint Summary (Captains)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/captains/register` | Register a new captain and return captain details with JWT token |
| POST | `/captains/login` | Login an existing captain and return captain details with JWT token |
| GET | `/captains/profile` | Get the currently authenticated captain profile |
| GET | `/captains/logout` | Logout the authenticated captain and blacklist current token |

### Register Captain

#### Endpoint

- **Method:** `POST`
- **Path:** `/captains/register`
- **Full URL (local):** `http://localhost:3000/captains/register`

#### Request Headers

- `Content-Type: application/json`

#### Request Body

```json
{
  "name": {
    "firstname": "Chetan",
    "lastname": "Sahney"
  },
  "email": "captain@example.com",
  "password": "mypassword123",
  "vehicle": {
    "color": "Black",
    "model": "Swift Dzire",
    "plate": "DL01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Field Requirements and Validation

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | Minimum length: 3 (current route validation checks `name`) |
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | Minimum length: 6 |
| `vehicle.color` | string | Yes | Must not be empty |
| `vehicle.model` | string | Yes | Must not be empty |
| `vehicle.plate` | string | Yes | Must not be empty |
| `vehicle.capacity` | number | Yes | Integer, minimum 1 |
| `vehicle.vehicleType` | string | Yes | One of: `car`, `bike`, `auto` |

#### Responses

##### 201 Created (Success)

```json
{
  "token": "<jwt_token_here>",
  "captain": {
    "name": {
      "firstname": "Chetan",
      "lastname": "Sahney"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "model": "Swift Dzire",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "unavailable",
    "_id": "65f0abc1234567890abcde12"
  }
}
```

##### 400 Bad Request

Possible cases:
- Request validation error
- Captain already exists with provided email (`Captain with this email already exists`)

##### 401 Unauthorized

Not used by register currently for validation failures.

### Login Captain

#### Endpoint

- **Method:** `POST`
- **Path:** `/captains/login`
- **Full URL (local):** `http://localhost:3000/captains/login`

#### Request Body

```json
{
  "email": "captain@example.com",
  "password": "mypassword123"
}
```

#### Responses

##### 200 OK (Success)

```json
{
  "token": "<jwt_token_here>",
  "captain": {
    "name": {
      "firstname": "Chetan",
      "lastname": "Sahney"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "model": "Swift Dzire",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "unavailable"
  }
}
```

##### 401 Unauthorized

Possible messages:
- `Captain with this email does not exist`
- `Invalid email or password`
- Validation errors array

### Get Captain Profile

#### Endpoint

- **Method:** `GET`
- **Path:** `/captains/profile`
- **Full URL (local):** `http://localhost:3000/captains/profile`

#### Authentication

Protected route. Send token via:
- Cookie: `token=<jwt_token>`
- Header: `Authorization: Bearer <jwt_token>`

#### 200 OK (Success)

Returns:

```json
{
  "captain": {
    "_id": "65f0abc1234567890abcde12",
    "name": {
      "firstname": "Chetan",
      "lastname": "Sahney"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "model": "Swift Dzire",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### 401 Unauthorized

Returned when token is missing, invalid, expired, or blacklisted.

### Logout Captain

#### Endpoint

- **Method:** `GET`
- **Path:** `/captains/logout`
- **Full URL (local):** `http://localhost:3000/captains/logout`

#### Authentication

Protected route. Send token via cookie or Bearer header.

#### 200 OK (Success)

```json
{
  "message": "Logged out successfully"
}
```

What happens on logout:
- `token` cookie is cleared.
- Current token is saved in `blacklistTokens` collection.

### End-to-End Captain Flow

1. `routes/captain.routes.js`
- Validates request body with `express-validator`.
- Calls captain controller handlers.
- Protects `/profile` and `/logout` with `authMiddleware.authCaptain`.

2. `controllers/captain.controller.js`
- Register: validates input, checks duplicate email, hashes password, creates captain using service, returns JWT.
- Login: validates input, verifies email/password, sets cookie token, returns JWT.
- Profile: returns `req.captain`.
- Logout: clears cookie, blacklists current token.

3. `services/captain.services.js`
- Verifies required captain fields.
- Creates captain document.

4. `models/captain.models.js`
- Defines captain + vehicle schema.
- Provides `generateAuthToken()`, `comparePassword()`, and `hashPassword()` helpers.

## Base URL

If you run the backend locally with default settings:

- `http://localhost:3000`

## Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register a new user and return user details with JWT token |
| POST | `/users/login` | Login an existing user and return user details with JWT token |
| GET | `/users/profile` | Get the currently authenticated user profile |
| GET | `/users/logout` | Logout the authenticated user and blacklist current token |

## Register User

### Endpoint

- **Method:** `POST`
- **Path:** `/users/register`
- **Full URL (local):** `http://localhost:3000/users/register`

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "name": {
    "firstname": "Chetan",
    "lastname": "Sahney"
  },
  "email": "chetan@example.com",
  "password": "mypassword123"
}
```

### Field Requirements and Validation

| Field | Type | Required | Validation |
|---|---|---|---|
| `name.firstname` | string | Yes | Minimum length: 3 |
| `name.lastname` | string | No | If provided, minimum length: 3 (schema-level) |
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | Minimum length: 6 |

## Responses

### 201 Created (Success)

Returned when validation passes and user is created successfully.

```json
{
  "user": {
    "name": {
      "firstname": "Chetan",
      "lastname": "Sahney"
    },
    "email": "chetan@example.com",
    "socketID": null,
    "_id": "65f0abc1234567890abcde12",
    "__v": 0
  },
  "token": "<jwt_token_here>"
}
```

Notes:
- Password is hashed before saving.
- JWT token is generated with `JWT_SECRET` and expires in `1h`.

### 400 Bad Request (Validation Error)

Returned when request data fails route-level validation.

Example:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "firstname should be at least 3 characters long",
      "path": "name.firstname",
      "location": "body"
    }
  ]
}
```

Possible messages include:
- `firstname should be at least 3 characters long`
- `Please enter a valid email address`
- `Password should be at least 6 characters long`

### Other Failure Cases

In case of database or unexpected server errors, the current code does not define a custom JSON error response in this flow. You may receive Express/Mongoose default error behavior depending on the failure.

## Login User

### Endpoint

- **Method:** `POST`
- **Path:** `/users/login`
- **Full URL (local):** `http://localhost:3000/users/login`

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "email": "chetan@example.com",
  "password": "mypassword123"
}
```

### Field Requirements and Validation

| Field | Type | Required | Validation |
|---|---|---|---|
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | Minimum length: 6 |

### Responses

#### 200 OK (Success)

Returned when email exists and password matches.

```json
{
  "user": {
    "name": {
      "firstname": "Chetan",
      "lastname": "Sahney"
    },
    "email": "chetan@example.com",
    "password": "$2b$10$<hashed_password>",
    "socketID": null,
    "_id": "65f0abc1234567890abcde12",
    "__v": 0
  },
  "token": "<jwt_token_here>"
}
```

Note:
- Current implementation selects `+password` and returns `user` directly, so the hashed password is included in login response.

#### 400 Bad Request (Validation Error)

Returned when request data fails route-level validation.

Example:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Not a valid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

Possible messages include:
- `Not a valid email address`
- `Password should be at least 6 characters long`

#### 401 Unauthorized (Invalid Credentials)

Returned when email is not found or password is incorrect.

```json
{
  "error": "Invalid email or password"
}
```

## Get User Profile

### Endpoint

- **Method:** `GET`
- **Path:** `/users/profile`
- **Full URL (local):** `http://localhost:3000/users/profile`

### Authentication

This is a protected route.

Send token in either of these ways:
- Cookie: `token=<jwt_token>`
- Header: `Authorization: Bearer <jwt_token>`

### Request Body

No request body is required.

### Responses

#### 200 OK (Success)

Returned when token is valid and not blacklisted.

```json
{
  "_id": "65f0abc1234567890abcde12",
  "name": {
    "firstname": "Chetan",
    "lastname": "Sahney"
  },
  "email": "chetan@example.com",
  "socketID": null,
  "__v": 0
}
```

#### 401 Unauthorized

Returned when token is missing, invalid, expired, or blacklisted.

```json
{
  "message": "unAuthprised"
}
```

## Logout User

### Endpoint

- **Method:** `GET`
- **Path:** `/users/logout`
- **Full URL (local):** `http://localhost:3000/users/logout`

### Authentication

This is a protected route.

Send token in either of these ways:
- Cookie: `token=<jwt_token>`
- Header: `Authorization: Bearer <jwt_token>`

### Request Body

No request body is required.

### Responses

#### 200 OK (Success)

Returned when logout is successful.

```json
{
  "message": "Logged out successfully"
}
```

What happens on logout:
- `token` cookie is cleared.
- Current token is stored in `blacklistTokens` collection.
- Blacklisted token becomes unusable for protected routes.

#### 401 Unauthorized

Returned when token is missing, invalid, expired, or blacklisted.

```json
{
  "message": "unAuthprised"
}
```

## End-to-End Flow (How It Works)

1. `routes/users.routes.js`
- Validates request body using `express-validator`.
- Calls `userController.register` for `/register`.
- Calls `userController.login` for `/login`.
- Protects `/profile` and `/logout` using `authMiddleware.authUser`.

2. `controllers/user.controllers.js`
- Register flow reads validation result, hashes password using `userModel.hashPassword(password)`, calls `userService.createUser(...)`, generates JWT using `user.generateAuthToken()`, and returns `201` with `{ user, token }`.
- Login flow reads validation result, finds the user by email with password selected, compares password using `user.comparePassword(password)`, generates JWT using `user.generateAuthToken()`, and returns `200` with `{ user, token }`.
- Profile flow returns `req.user` as the authenticated user.
- Logout flow clears auth cookie, blacklists the current token, and returns success message.

3. `services/user.services.js`
- Checks required fields: `firstname`, `email`, `password`.
- Creates user document using `userModel.create(...)`.

4. `models/user.models.js`
- Defines schema for `name`, `email`, `password`, `socketID`.
- Defines helpers:
  - `generateAuthToken()`
  - `comparePassword(password)`
  - `hashPassword(password)`

5. `middleware/auth.middleware.js`
- Reads token from cookie or Bearer header.
- Rejects blacklisted tokens.
- Verifies JWT and attaches user to `req.user`.

6. `models/blacklistTokens.model.js`
- Stores logged-out tokens so they cannot be reused.

## Example cURL Requests

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": {
      "firstname": "Chetan",
      "lastname": "Sahney"
    },
    "email": "chetan@example.com",
    "password": "mypassword123"
  }'
```

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chetan@example.com",
    "password": "mypassword123"
  }'
```

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt_token_here>"
```

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt_token_here>"
```

## Quick Checklist Before Testing

- `DB_CONNECT` is set in `.env`
- `JWT_SECRET` is set in `.env`
- MongoDB is running
- Backend server is running (`node server.js` or `npx nodemon server.js`)
