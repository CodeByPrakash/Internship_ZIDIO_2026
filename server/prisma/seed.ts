import { auth } from '../src/config/auth';
import prisma from '../src/config/prisma';

async function main() {
    console.log('🌱 Ensuring all demo accounts in Better Auth...');

    const users = [
        {
            email: 'admin@intellmeet.io',
            password: 'Password123',
            name: 'Enterprise Admin',
            role: 'admin',
            bio: 'System Administrator & Workspace Lead',
        },
        {
            email: 'demo@intellmeet.io',
            password: 'Demo1234!',
            name: 'Alex Johnson',
            role: 'member',
            bio: 'Senior Product Designer',
        },
    ];

    for (const u of users) {
        const existing = await prisma.user.findUnique({ where: { email: u.email } });
        if (existing) {
            await prisma.account.deleteMany({ where: { userId: existing.id } });
            await prisma.session.deleteMany({ where: { userId: existing.id } });
            await prisma.user.delete({ where: { id: existing.id } });
        }

        await auth.api.signUpEmail({
            body: {
                name: u.name,
                email: u.email,
                password: u.password,
            },
        });

        await prisma.user.update({
            where: { email: u.email },
            data: { role: u.role, bio: u.bio },
        });
    }

    console.log('✅ All Better Auth accounts seeded:');
    console.log('   👑 Admin: admin@intellmeet.io | Password123 (role: admin)');
    console.log('   👤 Demo:  demo@intellmeet.io  | Demo1234!   (role: member)');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
