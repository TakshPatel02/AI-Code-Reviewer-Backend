# AI Code Reviewer Backend

Backend API for an AI-powered code review platform. This service handles user authentication, AI review generation, and user review history management.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (access + refresh token flow)
- Zod (request validation)
- Google Gemini API (`@google/genai`)

## Features

- User signup/login with hashed passwords (`bcrypt`)
- JWT-based authentication with access token + refresh token
- Refresh token stored securely in `httpOnly` cookie
- Protected routes using Bearer access token middleware
- AI code review generation via Gemini
- Per-user review history (list, fetch by ID, delete)
- Limit of 5 saved reviews per user account

## Project Structure

```text
.
|-- connection.js
|-- index.js
|-- controllers/
|   |-- auth.controller.js
|   |-- code.controller.js
|   `-- user.controller.js
|-- middlewares/
|   `-- authenticated.middleware.js
|-- models/
|   |-- code.model.js
|   `-- user.model.js
|-- routes/
|   |-- auth.routes.js
|   |-- code.routes.js
|   `-- user.routes.js
|-- services/
|   `-- ai.service.js
|-- utils/
|   `-- token.util.js
`-- validations/
		`-- user.validations.js
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_code_reviewer

JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret

GEMINI_API_KEY=your_gemini_api_key
```

## Installation and Run

```bash
npm install
npm run start
```

The server starts on the port from `PORT`.

## Base URL

Local:

```text
http://localhost:<PORT>
```

Health route:

- `GET /` -> `Hello World`

## Authentication Flow

1. `POST /auth/signup` or `POST /auth/login`
2. API returns an `accessToken` in JSON response.
3. API also sets a `refreshToken` cookie (`httpOnly`, `secure`, `sameSite=strict`).
4. Send `Authorization: Bearer <accessToken>` for protected routes.
5. Use `GET /auth/refresh-token` to get a new access token (uses refresh cookie).

## API Endpoints

### Auth Routes (`/auth`)

1. `POST /auth/signup`

Request body:

```json
{
  "username": "taksh",
  "email": "taksh@example.com",
  "password": "123456"
}
```

Validation:

- `username`: minimum 3 chars
- `email`: valid email
- `password`: minimum 6 chars

2. `POST /auth/login`

Request body:

```json
{
  "email": "taksh@example.com",
  "password": "123456"
}
```

3. `PATCH /auth/logout` (Protected)

- Requires Bearer access token
- Clears refresh token cookie and DB-stored refresh token

4. `GET /auth/protected` (Protected)

- Test route to verify access token auth

5. `GET /auth/refresh-token`

- Uses refresh token cookie
- Returns new `accessToken`

### Code Routes (`/code`)

1. `POST /code/review` (Protected)

Request body:

```json
{
  "code": "function sum(a,b){return a+b;}"
}
```

Behavior:

- Sends code to Gemini reviewer service
- Saves review in MongoDB
- Enforces max 5 reviews per user

### User Routes (`/user`)

1. `GET /user/reviews` (Protected)

- Returns all reviews for authenticated user

2. `GET /user/reviews/:id` (Protected)

- Returns one review by ID (only if it belongs to authenticated user)

3. `DELETE /user/reviews/:id` (Protected)

- Deletes one review by ID (only if it belongs to authenticated user)

## Response Format

Most endpoints follow this response shape:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Some endpoints return route-specific fields, for example `/code/review` returns `review` directly.

## Auth Header Example

```http
Authorization: Bearer <your_access_token>
```

## CORS Notes

Current CORS configuration allows:

- Origin: `https://ai-code-reviewer-eight-smoky.vercel.app`
- Credentials: enabled

If you run a different frontend locally, update CORS settings in `index.js`.

## Important Notes

- Refresh token cookie is configured with `secure: true`; in non-HTTPS local setups, browser cookie behavior may differ.
- Keep JWT secrets and Gemini API key private.
- Access token expiry is 1 hour, refresh token expiry is 7 days.
