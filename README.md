# Technical Documentation: Wallet System

## Introduction

This documentation outlines the design and implementation of a simple wallet system. The wallet system allows users to perform <code>Account crediting</code>, <code>Account Debit</code> and <code>make Transfer</code>

## Technologies Used
* Node.js - es6+
* ExpressJs
* TypeScript
* Mongoose (ODM for MongoDB) - explicit schema definitions.
* Jest
* pino

## Decision
- Created two models: <b>users</b> and <b>accounts</b>.
  - Users model store users information `(name, email and _id)`
  - Account model store wallet data `(accountId, active, balance)`
  - accountId points to user(`_id` - ObjectId)


# Installation and Setup

1. Clone the Repository:

- ```git clone https://github.com/mbanda1/my-wallet.git```
- ```cd my-wallet```
- ```npm install```

2. Environment Variables:
   
I hardcoded .env, you may change configuration details.

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/wallet_db
```

1. Start
   - `npm run dev` - this will also seeds initial users <b>(we ned userId to serve as account numbers)</b>

2. Build
   
   - ```npm run build```

## API Endpoints
The wallet system exposes the following API endpoints for wallet operations:

### 1. Credit Wallet Account

<code>URL:</code> /api/wallet/credit
<code>Method:</code> POST
<code>Request Body:</code>

> Request

```
{
    "accountId": "65fd89474821cebc7d79a683",
    "amount": 2000
}
```

> Response
```
{
    "_id": "65fdb885700e471e27588e62",
    "accountId": "65fdaaefa39c90915498209d",
    "__v": 0,
    "active": true,
    "balance": 3,
    "updatedAt": "2024-03-22T16:57:41.855Z"
}
```

2. Debit Wallet Account
<code>URL:</code> /api/wallet/debit
<code>Method:</code> POST
<code>Request Body:</code>

> Request
```
{
    "accountId": "65fd89474821cebc7d79a683",
    "amount": 2
}
```
> Response
```
{
    "_id": "65fdb885700e471e27588e62",
    "accountId": "65fdaaefa39c90915498209d",
    "__v": 0,
    "active": true,
    "balance": 1,
    "updatedAt": "2024-03-22T16:57:41.855Z"
}
```

1. Make transaction - account transfer
<code>URL:</code> /api/transaction/send
<code>Method:</code> POST
<code>Request Body:</code>

> Request
```
{
    "creditAccountId": "65fdaaefa39c90915498209e",
    "debitAccountId": "65fdaaefa39c90915498209d",
    "amount": 1
}
```

> Response
```
{
    "debitAccount": {
        "_id": "65fdb885700e471e27588e62",
        "accountId": "65fdaaefa39c90915498209d",
        "__v": 0,
        "active": true,
        "balance": 0,
        "updatedAt": "2024-03-22T16:57:41.855Z"
    },
    "creditAccount": {
        "_id": "65fdbf0b700e471e275892e5",
        "accountId": "65fdaaefa39c90915498209e",
        "__v": 0,
        "active": true,
        "balance": 1,
        "updatedAt": "2024-03-22T17:25:31.143Z"
    }
}
```

## Error Handling
The wallet system implements proper error handling by providing meaningful error messages in the response body along with appropriate HTTP status codes for different error scenarios.

## Tests
 - run `npm run test`

Implemented unit test for all services with jest.

## Logging
Used different log levels (e.g., INFO, WARN, ERROR) to categorize log messages based on their importance. Utilized *Pino* a fast and low overhead Node.js logger.