const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createCustomAdmin() {
  try {
    console.log('🔧 Create New Admin Account');
    console.log('═══════════════════════════════════════\n');
    
    const username = await question('Enter username: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    
    if (!username || !email || !password) {
      console.log('\n❌ All fields are required!');
      rl.close();
      await prisma.$disconnect();
      process.exit(1);
    }
    
    console.log('\n🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('💾 Creating admin in database...');
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: 'admin',
        isEmailVerified: true,
      },
    });
    
    console.log('\n✅ Admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password:', password);
    console.log('ID:', admin.id);
    console.log('═══════════════════════════════════════\n');
    
    rl.close();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    
    if (error.code === 'P2002') {
      console.log('⚠️  Admin with this username or email already exists!');
    }
    
    rl.close();
    await prisma.$disconnect();
    process.exit(1);
  }
}

createCustomAdmin();
