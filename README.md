# Wallet Service

A NestJS backend application with a complete wallet system including transactions, built with Prisma ORM and PostgreSQL database.

## Production URL

The live service URL can be accessed at: [https://wallet-service-7ceb.onrender.com](https://wallet-service-7ceb.onrender.com).

Note: This application is hosted on a free hosting service, so it may take 1–2 minutes to load the first time.

## Technologies Used

- 🚀 **NestJS Framework** - Modern, scalable Node.js framework
- 🗄️ **Prisma ORM** - Type-safe database client with PostgreSQL
- 📚 **Swagger Documentation** - Auto-generated API documentation
- ✅ **Validation** - Request validation with class-validator
- 🧪 **Testing Setup** - Jest testing framework configured (Unit & E2E)
- ⚙️ **Configuration Management** - Environment-based configuration
- 🔒 **Concurrency Handling** - Race condition prevention for transactions

## Features
- 💰 **Wallet System**
  - **Initialize New Wallet**: Create a new wallet with an initial balance.
  - **Credit/Debit Transactions**: Perform credit and debit transactions on a wallet.
  - **Transaction History**: Retrieve paginated transaction history for a wallet, with sorting options.

### Key Features Implemented
1. **Precision Handling**: All monetary values use 4 decimal precision
2. **Concurrency Control**: Database transactions prevent race conditions
3. **Input Validation**: Comprehensive validation for all inputs
4. **Error Handling**: Proper error responses for various scenarios
5. **Pagination**: Efficient pagination for transaction lists
6. **Type Safety**: Full TypeScript support with Prisma


## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database

## Project Setup
To set up and run the project locally, follow these steps:

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


5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations**
   ```bash
   npm run prisma:migrate
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
   npm run deploy
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at: [https://wallet-service-7ceb.onrender.com/api/docs](https://wallet-service-7ceb.onrender.com/api/docs)

## API Endpoints

### Wallets Module

#### 1. Setup Wallet
- **POST** `/setup`
- **Purpose**: Initialize a new wallet with initial balance
- **cURL Example**:
  ```bash
  curl -X POST https://wallet-service-7ceb.onrender.com/setup \
    -H "Content-Type: application/json" \
    -d '{
      "balance": 20.5612,
      "name": "Dixa"
    }'
  ```
- **Request Body**:
  ```json
  {
    "balance": 20.5612,
    "name": "Dixa"
  }
  ```
- **Response**:
  ```json
  {
    "id": "061f4771-f96a-4e65-b798-4e6031215567",
    "balance": 20.5612,
    "transactionId": "be41cd6f-9a9f-4eb0-b30c-422966accecd",
    "name": "Dixa",
    "date": "2025-08-04T03:56:41.685Z"
    }
  ```

#### 2. Get Wallet Details
- **GET** `/wallet/:id`
- **Purpose**: Retrieve specific wallet information
- **cURL Example**:
  ```bash
  curl -X GET https://wallet-service-7ceb.onrender.com/wallet/061f4771-f96a-4e65-b798-4e6031215567
  ```
- **Response**:
  ```json
  {
    "id": "061f4771-f96a-4e65-b798-4e6031215567",
    "balance": 20.5612,
    "name": "Dixa",
    "date": "2025-08-04T03:56:41.685Z"
  }
  ```

### Transactions Module

#### 1. Credit/Debit Transaction
- **POST** `/transact/:walletId`
- **Purpose**: Credit or Debit transaction on a wallet
- **cURL Example**:
  ```bash
  curl -X POST https://wallet-service-7ceb.onrender.com/transact/061f4771-f96a-4e65-b798-4e6031215567 \
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
    "balance": 30.5612,
    "transactionId": "3a5095de-b6b8-4951-a66a-3cf1f1d9a95a"
  }
  ```

#### 2. Get Wallet Transactions
- **GET** `/transactions?walletId=2434343&skip=10&limit=25&sortBy=amount&order=desc`
- **Purpose**: Retrieve paginated list of transactions for a wallet with optional sorting
- **Query Parameters**:
  - `walletId` (required): Wallet ID
  - `skip` (optional): Number of records to skip (default: 0)
  - `limit` (optional): Maximum records to fetch (default: 10, max: 100)
  - `sortBy` (optional): Field to sort by - amount or date (default: date)
  - `order` (optional): Sort order - asc or desc (default: desc)
  - `exportAll` (optional): If true, returns all transactions ignoring `skip` and `limit` (default: `false`)
- **cURL Example**:
  ```bash
  # Sort by amount (highest first)
  curl -X GET "https://wallet-service-7ceb.onrender.com/transactions?walletId=123e4567-e89b-12d3-a456-426614174000&skip=0&limit=10&sortBy=amount&order=desc"
  
  # Sort by amount (lowest first)
  curl -X GET "https://wallet-service-7ceb.onrender.com/transactions?walletId=123e4567-e89b-12d3-a456-426614174000&skip=0&limit=10&sortBy=amount&order=asc"
  
  # Sort by date (newest first)
  curl -X GET "https://wallet-service-7ceb.onrender.com/transactions?walletId=123e4567-e89b-12d3-a456-426614174000&skip=0&limit=10&sortBy=date&order=desc"
  
  # Sort by date (oldest first)
  curl -X GET "https://wallet-service-7ceb.onrender.com/transactions?walletId=123e4567-e89b-12d3-a456-426614174000&skip=0&limit=10&sortBy=date&order=asc"

  # Export all transactions
  curl -X GET "https://wallet-service-7ceb.onrender.com/transactions?walletId=123e4567-e89b-12d3-a456-426614174000&exportAll=true"
  ```
- **Response**:
  ```json
  {
    "total": 1,
    "transactions": [
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
  }
  ```

### Health Check
- **GET** `/` - Application status
  ```bash
  curl -X GET https://wallet-service-7ceb.onrender.com/
  ```
- **GET** `/health` - Health check endpoint
  ```bash
  curl -X GET https://wallet-service-7ceb.onrender.com/health
  ```

## Database Management

### Prisma Commands

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:migrate:deploy` - Deploy migrations to production
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

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
├── wallets/                                # Wallet module
│   ├── dto/
│   │   └── wallet.dto.ts                   # Data Transfer Objects
│   ├── wallets.controller.ts               # Handles wallet API requests
│   ├── wallets.controller.spec.ts          # Unit tests for wallet controller
│   ├── wallets.service.ts                  # Business logic for wallets
│   └── wallets.module.ts                   # Module for wallets
├── transactions/                           # Transaction module
│   ├── dto/
│   │   └── transaction.dto.ts              # Data Transfer Objects
│   ├── transactions.controller.ts          # Handles transaction API requests
│   ├── transactions.controller.spec.ts     # Unit tests for transaction controller
│   ├── transactions.service.ts             # Business logic for transactions
│   ├── transactions.service.spec.ts        # Unit tests for transaction service
│   └── transactions.module.ts              # Module for transactions
├── prisma/                                 # Prisma ORM integration
│   ├── prisma.service.ts                   # Prisma client service
│   └── prisma.module.ts                    # NestJS module for Prisma
├── app.controller.ts                       # Main application controller
├── app.controller.spec.ts                  # Unit tests for main application controller
├── app.service.ts                          # Main application service
├── app.module.ts                           # Main application module
└── main.ts                                 # Application entry point

prisma/                                     # Prisma schema and migrations
├── schema.prisma                           # Database schema definition
└── seed.ts                                 # Database seeding script

test/                                       # End-to-End (E2E) tests
├── wallets.e2e-spec.ts                     # E2E tests for wallet module
├── transactions.e2e-spec.ts                # E2E tests for transaction module
└── jest-e2e.json                           # Jest configuration
```