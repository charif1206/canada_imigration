const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAdmins() {
  try {
    console.log('🔍 Fetching all admin accounts...\n');
    
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
    
    if (admins.length === 0) {
      console.log('❌ No admin accounts found in database.');
    } else {
      console.log(`✅ Found ${admins.length} admin account(s):\n`);
      console.log('═══════════════════════════════════════════════════════════════');
      admins.forEach((admin, index) => {
        console.log(`\nAdmin #${index + 1}:`);
        console.log(`  Username: ${admin.username}`);
        console.log(`  Email: ${admin.email || 'N/A'}`);
        console.log(`  Role: ${admin.role}`);
        console.log(`  Email Verified: ${admin.isEmailVerified ? '✓' : '✗'}`);
        console.log(`  Created: ${admin.createdAt.toLocaleString()}`);
        console.log(`  ID: ${admin.id}`);
      });
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('\n💡 Default password for admin: admin123');
    }
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

listAdmins();
