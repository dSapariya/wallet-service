import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test wallet
  const wallet = await prisma.wallet.upsert({
    where: { id: 'test-wallet-1' },
    update: {},
    create: {
      id: 'test-wallet-1',
      name: 'Test Wallet',
      balance: 100.5000,
    },
  });

  // Create some sample transactions
  await prisma.transaction.upsert({
    where: { id: 'test-transaction-1' },
    update: {},
    create: {
      id: 'test-transaction-1',
      walletId: wallet.id,
      amount: 100.5000,
      balance: 100.5000,
      description: 'Initial wallet setup',
      type: 'CREDIT',
    },
  });

  await prisma.transaction.upsert({
    where: { id: 'test-transaction-2' },
    update: {},
    create: {
      id: 'test-transaction-2',
      walletId: wallet.id,
      amount: 25.7500,
      balance: 126.2500,
      description: 'Recharge',
      type: 'CREDIT',
    },
  });

  await prisma.transaction.upsert({
    where: { id: 'test-transaction-3' },
    update: {},
    create: {
      id: 'test-transaction-3',
      walletId: wallet.id,
      amount: -15.3000,
      balance: 110.9500,
      description: 'Purchase',
      type: 'DEBIT',
    },
  });

  console.log('Seed data created successfully!');
  console.log('Test wallet ID:', wallet.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 