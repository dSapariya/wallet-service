# Dev HighLevel Backend - Wallet System

A NestJS backend application with a complete wallet system including transactions, built with Prisma ORM and PostgreSQL database.

## Features

- 🚀 **NestJS Framework** - Modern, scalable Node.js framework
- 💰 **Wallet System** - wallet management with transactions
- 🗄️ **Prisma ORM** - Type-safe database client with PostgreSQL
- 📚 **Swagger Documentation** - Auto-generated API documentation
- ✅ **Validation** - Request validation with class-validator
- 🧪 **Testing Setup** - Jest testing framework configured
- ⚙️ **Configuration Management** - Environment-based configuration
- 🔒 **Concurrency Handling** - Race condition prevention for transactions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wallet-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@wallet-system:5432/dbname?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up PostgreSQL database**
   - Create a database named `wallet-system` (or update the DATABASE_URL in .env)
   - Ensure PostgreSQL is running and accessible

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

7. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

8. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## API Endpoints

### Wallets Module

#### 1. Setup Wallet
- **POST** `/setup`
- **Purpose**: Initialize a new wallet with initial balance
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/setup \
    -H "Content-Type: application/json" \
    -d '{
      "balance": "20.5612",
      "name": "Hello world"
    }'
  ```
- **Request Body**:
  ```json
  {
    "balance": "20.5612",
    "name": "Hello world"
  }
  ```
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "balance": 20.5612,
    "transactionId": "987fcdeb-51a2-43d1-b789-123456789abc",
    "name": "Hello world",
    "date": "2025-08-02T00:00:00.000Z"
  }
  ```

#### 2. Get Wallet Details
- **GET** `/wallet/:id`
- **Purpose**: Retrieve specific wallet information
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/wallet/123e4567-e89b-12d3-a456-426614174000
  ```
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "balance": 12.4,
    "name": "Wallet A",
    "date": "2025-08-02T00:00:00.000Z"
  }
  ```

### Transactions Module

#### 1. Create Transaction
- **POST** `/transact/:walletId`
- **Purpose**: Credit or debit transaction on a wallet
- **cURL Example**:
  ```bash
  curl -X POST http://localhost:3000/transact/123e4567-e89b-12d3-a456-426614174000 \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 10,
      "description": "Recharge"
    }'
  ```
- **Request Body**:
  ```json
  {
    "amount": 10,
    "description": "Recharge"
  }
  ```
- **Response**:
  ```json
  {
    "balance": 30,
    "transactionId": "987fcdeb-51a2-43d1-b789-123456789abc"
  }
  ```

#### 2. Get Wallet Transactions
- **GET** `/transactions?walletId=2434343&skip=10&limit=25`
- **Purpose**: Retrieve paginated list of transactions for a wallet
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/transactions?walletId=123e4567-e89b-12d3-a456-426614174000&skip=10&limit=25"
  ```
- **Response**:
  ```json
  [
    {
      "id": "987fcdeb-51a2-43d1-b789-123456789abc",
      "walletId": "123e4567-e89b-12d3-a456-426614174000",
      "amount": 2.4,
      "balance": 12.4,
      "description": "Recharge",
      "date": "2025-08-02T00:00:00.000Z",
      "type": "CREDIT"
    }
  ]
  ```

#### 3. Get All Transactions
- **GET** `/transactions/all?skip=0&limit=10`
- **Purpose**: Retrieve all transactions in the system
- **cURL Example**:
  ```bash
  curl -X GET "http://localhost:3000/all?skip=0&limit=10"
  ```
- **Response**:
  ```json
  [
    {
      "id": "987fcdeb-51a2-43d1-b789-123456789abc",
      "walletId": "123e4567-e89b-12d3-a456-426614174000",
      "amount": 25.7500,
      "balance": 126.2500,
      "description": "Recharge",
      "date": "2025-08-02T10:30:00.000Z",
      "type": "CREDIT",
      "wallet": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "My Wallet"
      }
    }
  ]
  ```

#### 4. Get Transaction by ID
- **GET** `/transactions/transaction/:id`
- **Purpose**: Retrieve specific transaction details
- **cURL Example**:
  ```bash
  curl -X GET http://localhost:3000/transaction/987fcdeb-51a2-43d1-b789-123456789abc
  ```
- **Response**:
  ```json
  {
    "id": "987fcdeb-51a2-43d1-b789-123456789abc",
    "walletId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 25.7500,
    "balance": 126.2500,
    "description": "Recharge",
    "date": "2025-08-02T10:30:00.000Z",
    "type": "CREDIT",
    "wallet": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "My Wallet"
    }
  }
  ```

### Health Check
- **GET** `/` - Application status
  ```bash
  curl -X GET http://localhost:3000/
  ```
- **GET** `/health` - Health check endpoint
  ```bash
  curl -X GET http://localhost:3000/health
  ```

## Database Management

### Prisma Commands

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:migrate:deploy` - Deploy migrations to production
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:seed` - Seed database with initial data

### Database Schema

The application includes two main models:

#### Wallet Model
- `id` (String) - Primary key (UUID)
- `name` (String) - Wallet name
- `balance` (Decimal) - Current balance (4 decimal precision)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp
- `transactions` (Transaction[]) - Related transactions

#### Transaction Model
- `id` (String) - Primary key (UUID)
- `walletId` (String) - Wallet reference
- `amount` (Decimal) - Transaction amount (4 decimal precision)
- `balance` (Decimal) - Balance after transaction
- `description` (String) - Transaction description
- `type` (TransactionType) - CREDIT or DEBIT
- `createdAt` (DateTime) - Transaction timestamp
- `wallet` (Wallet) - Wallet relationship

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start:prod` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── wallets/
│   ├── dto/
│   │   └── wallet.dto.ts
│   ├── wallets.controller.ts
│   ├── wallets.service.ts
│   └── wallets.module.ts
├── transactions/
│   ├── dto/
│   │   └── transaction.dto.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.module.ts
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma
└── seed.ts
```

## Development

### Key Features Implemented

1. **Precision Handling**: All monetary values use 4 decimal precision
2. **Concurrency Control**: Database transactions prevent race conditions
3. **Input Validation**: Comprehensive validation for all inputs
4. **Error Handling**: Proper error responses for various scenarios
5. **Pagination**: Efficient pagination for transaction lists
6. **Type Safety**: Full TypeScript support with Prisma

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## License

This project is licensed under the MIT License.