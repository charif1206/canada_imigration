#!/bin/bash
# 🚀 Create Admin Script
# Usage: bash create-admin.sh

echo "========================================="
echo "🛠️ Create New Admin with Prisma"
echo "========================================="
echo ""

# Step 1: Check if we're in backend
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the 'backend' directory:"
    echo "  cd backend"
    echo "  bash create-admin.sh"
    exit 1
fi

echo "✅ Backend directory found"
echo ""

# Step 2: Get input from user
read -p "Enter username (required): " username
if [ -z "$username" ]; then
    echo "❌ Username cannot be empty"
    exit 1
fi

read -p "Enter email (optional, press Enter to skip): " email

read -sp "Enter password (will be hashed): " password
echo ""
if [ -z "$password" ]; then
    echo "❌ Password cannot be empty"
    exit 1
fi

read -p "Enter role (admin/super-admin/moderator) [default: admin]: " role
role=${role:-admin}

echo ""
echo "========================================="
echo "📋 Admin Details"
echo "========================================="
echo "Username: $username"
echo "Email: ${email:-(none)}"
echo "Role: $role"
echo ""

# Step 3: Create the TypeScript script
cat > /tmp/create_admin_temp.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const username = process.argv[2];
  const email = process.argv[3] || null;
  const password = process.argv[4];
  const role = process.argv[5];

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if exists
    const existing = await prisma.admin.findUnique({
      where: { username },
    });

    if (existing) {
      console.log(`❌ Admin with username '${username}' already exists`);
      process.exit(1);
    }

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email: email !== 'null' ? email : null,
        password: hashedPassword,
        role,
      },
    });

    console.log('✅ Admin created successfully!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email || '(none)'}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
EOF

# Step 4: Run the script
echo "🔄 Creating admin..."
echo ""

npx ts-node /tmp/create_admin_temp.ts "$username" "$email" "$password" "$role"

# Step 5: Cleanup
rm /tmp/create_admin_temp.ts

echo ""
echo "========================================="
echo "✅ Done!"
echo "========================================="
echo ""
echo "Test your new admin:"
echo "  POST http://localhost:3000/auth/login"
echo "  Body: {\"username\": \"$username\", \"password\": \"$password\"}"
echo ""
