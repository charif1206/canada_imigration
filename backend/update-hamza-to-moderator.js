const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateHamzaToModerator() {
  try {
    console.log('🔧 Updating Hamza to moderator role...');
    
    // Find Hamza's account
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        username: 'hamza'
      }
    });

    if (!existingAdmin) {
      console.log('\n❌ Admin "hamza" not found!');
      await prisma.$disconnect();
      process.exit(1);
    }

    console.log('\n📋 Current account details:');
    console.log('═══════════════════════════════════════');
    console.log('Username:', existingAdmin.username);
    console.log('Email:', existingAdmin.email);
    console.log('Current Role:', existingAdmin.role);
    console.log('ID:', existingAdmin.id);
    console.log('═══════════════════════════════════════\n');
    
    // Update role to moderator
    const updatedAdmin = await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: { role: 'moderator' }
    });
    
    console.log('✅ Hamza updated to moderator successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Username:', updatedAdmin.username);
    console.log('Email:', updatedAdmin.email);
    console.log('New Role:', updatedAdmin.role);
    console.log('ID:', updatedAdmin.id);
    console.log('═══════════════════════════════════════\n');
    console.log('🚀 Hamza can now add new admins!');
    console.log('\n');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateHamzaToModerator();
