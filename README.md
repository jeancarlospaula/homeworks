# HomeWorks
Back-end API of a tasks manager application

<div style="display: inline_block">
  <img align="center" alt="NodeJS" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
  <img align="center" alt="Jest" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg">
  <img align="center" alt="MongoDB" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg" />
  <img align="center" alt="heroku" height="30" width="40" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-plain-wordmark.svg">
</div><br>

## Account Routes
### Create an account
- **POST:** `/account/register`
- **Params type:** `Body`
- **Body params:** `firstName`, `lastName`, `email` and `password`

### Send account confirmation email
- **POST:** `/account/confirm`
- **Params type:** `Body`
- **Body params:** `email`

### Confirm account
- **PATCH:** `/account/confirm`
- **Param type:** `Body`
- **Body params:** `email` and `confirmationToken`

### Send reset password email
- **POST:** `/account/reset/password`
- **Param type:** `Body`
- **Body params:** `email`
  
### Reset password
- **PATCH:** `/account/reset/password/:id`
- **Params types:** `Route` and `Body`
- **Body params:** `password`

### Login
- **POST:** `/account/login`
- **Param type:** `Body`
- **Body params:** `email` and `password`

### Logout
- **POST:** `/account/logout`
- **Param type:** `Header`
- **Header param:** `x-access-token`

## Subject Routes
### Create a subject
- **POST:** `/subject/create`
- **Params types:** `Body` and `Header`
- **Body param:** `name`
- **Header param:** `x-access-token`

### List all user subjects
- **GET:** `/subject/list`
- **Param type:** `Header`
- **Header param:** `x-access-token`

### Get an user subject by id
- **GET:** `/subject/:id`
- **Params types:** `Header` and `Route`
- **Header param:** `x-access-token`

### Delete an user subject by id
- **DELETE:** `/subject/:id`
- **Params types:** `Header` and `Route`
- **Header param:** `x-access-token`

*More routes will come soon

## Front-end wireframe
![home-works-scope](https://user-images.githubusercontent.com/79765050/176801314-b38d96c9-dcfa-4d47-9099-3a0875023476.png)
