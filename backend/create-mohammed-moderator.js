const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createMohammedModerator() {
  try {
    console.log('🔧 Creating Mohammed moderator account...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('chrif1206', 10);
    
    // Check if moderator already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: 'mohammed' },
          { email: 'mohammed@canada-immigration.com' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('\n⚠️  Admin "mohammed" already exists - Deleting and recreating...');
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
    
    // Create moderator
    const admin = await prisma.admin.create({
      data: {
        username: 'mohammed',
        password: hashedPassword,
        email: 'mohammed@canada-immigration.com',
        role: 'moderator',
        isEmailVerified: true,
      },
    });
    
    console.log('\n✅ Mohammed moderator created successfully!');
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
    console.error('❌ Error creating moderator:', error.message);
    
    if (error.code === 'P2002') {
      console.log('\n⚠️  Admin with this username or email already exists!');
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

createMohammedModerator();
