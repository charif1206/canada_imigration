const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Creating admin account...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@canada-immigration.com',
        role: 'admin',
        isEmailVerified: true,
      },
    });
    
    console.log('\n✅ Admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('ID:', admin.id);
    console.log('═══════════════════════════════════════\n');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    
    if (error.code === 'P2002') {
      console.log('\n⚠️  Admin with this username or email already exists!');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
