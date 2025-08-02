import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test wallet
  const wallet = await prisma.wallet.create({
    data: {
      name: 'Test Wallet',
      balance: 100.5000,
    },
  });

  // Create some sample transactions
  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount: 100.5000,
      balance: 100.5000,
      description: 'Initial wallet setup',
      type: 'CREDIT',
    },
  });

  await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      amount: 25.7500,
      balance: 126.2500,
      description: 'Recharge',
      type: 'CREDIT',
    },
  });

  await prisma.transaction.create({
    data: {
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