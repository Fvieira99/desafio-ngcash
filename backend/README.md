# Backend - NG.CASH

## About it

This project allows the users to make transactions between them.

## Stack used

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.Js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JWT](https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

## Installation and running steps

### After cloning the project go to frontend directory:

```bash
    cd NgCash/backend
```

### Install dependencies:

```
    npm install
```

Then create .env following .env.example file

### Create database:

```
    npx prisma migrate dev
```

### Run it on dev mode:

Now you are good to go!

```bash
    npm run dev
```

It will run on localhost:${chosen port}

### Build it:

```bash
    npm run build
```

### Run it on production mode:

```bash
    npm run start
```

### Run unit tests:

```bash
    npm run test:unit
```

### Run integration tests:

```bash
    npm run test:integration
```

## Routes

### Sign Up

```http
    POST /signup
```

#### Request:

| Body       | Type     | Description                                                                                                 |
| :--------- | :------- | :---------------------------------------------------------------------------------------------------------- |
| `username` | `string` | **Required**. **Must contain at least 3 characters**                                                        |
| `password` | `string` | **Required**. **Must contain at least 8 characters including at least one number and one uppercase letter** |

### Sign In

```http
    POST /signin
```

#### Request:

| Body       | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `username` | `string` | **Required**. Website Username |
| `password` | `string` | **Required**. Website Password |

#### Response:

```json
    {
        token: string
    }
```

### Get user info:

```http
    GET /user-info
```

#### Request:

| Headers         | Type     | Description                                       |
| :-------------- | :------- | :------------------------------------------------ |
| `Authorization` | `string` | **Required**. JWT Access Token: "Bearer ${Token}" |

#### Response:

```json
    {
        username: string,
        userId: number,
        account: {
            id: number,
            balance: number,
        }
    }
```

### Create Transaction

```http
    POST/ transactions/cashout
```

#### Request:

| Body                           | Type     | Description   |
| :----------------------------- | :------- | :------------ |
| `creditedAccountOwnerUsername` | `string` | **Required**. |
| `value`                        | `number` | **Required**. |

### Get user transactions

```http
    GET/ transactions
```

#### Query Params:

Both params are optional. If you dont pass any of them the request will return all user transactions in asc order.

| Params          | Type                                    | Description   |
| :-------------- | :-------------------------------------- | :------------ |
| `whereFilter`   | `creditedAccountId or debitedAccountId` | **Optional**. |
| `orderByFilter` | `asc or desc`                           | **Optional**. |

#### Response:

```json
[
    {
        id: number,
        debitedAccountOwnerUsername: string,
        creditedAccountOwnerUsername: string,
        value: number,
        createdAt: date,
    },
]
```
