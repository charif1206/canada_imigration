const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createHamzaAdmin() {
  try {
    console.log('🔧 Creating Hamza admin account...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('chrif1206', 10);
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: 'hamza' },
          { email: 'hamza@canada-immigration.com' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('\n⚠️  Admin "hamza" already exists - Deleting and recreating...');
      console.log('═══════════════════════════════════════');
      console.log('Old Username:', existingAdmin.username);
      console.log('Old Email:', existingAdmin.email);
      console.log('Old Role:', existingAdmin.role);
      console.log('═══════════════════════════════════════\n');
      
      // Delete existing admin
      await prisma.admin.delete({
        where: { id: existingAdmin.id }
      });
      console.log('✅ Existing account deleted.');
    }
    
    // Create admin (not moderator)
    const admin = await prisma.admin.create({
      data: {
        username: 'hamza',
        password: hashedPassword,
        email: 'hamza@canada-immigration.com',
        role: 'admin',
        isEmailVerified: true,
      },
    });
    
    console.log('\n✅ Hamza admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Username:', admin.username);
    console.log('Password: chrif1206');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('ID:', admin.id);
    console.log('═══════════════════════════════════════\n');
    console.log('🚀 You can now login at: https://canada-immigration-admin-kz5bvzfjy.vercel.app/login');
    console.log('\n');
    
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

createHamzaAdmin();
