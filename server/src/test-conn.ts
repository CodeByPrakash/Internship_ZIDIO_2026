import { PrismaClient } from '@prisma/client';

async function testConnection() {
    const urls = [
        {
            name: 'Direct (Unpooled, sslmode=require)',
            url: 'postgresql://neondb_owner:npg_CDZ3XWQ1iFEK@ep-fragrant-fire-az26mctw.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
        },
        {
            name: 'Pooled (sslmode=require, connect_timeout=15)',
            url: 'postgresql://neondb_owner:npg_CDZ3XWQ1iFEK@ep-fragrant-fire-az26mctw-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15'
        },
        {
            name: 'Direct with pgbouncer=true',
            url: 'postgresql://neondb_owner:npg_CDZ3XWQ1iFEK@ep-fragrant-fire-az26mctw-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true'
        }
    ];

    for (const item of urls) {
        console.log(`\nTesting: ${item.name}...`);
        const prisma = new PrismaClient({ datasources: { db: { url: item.url } } });
        try {
            await prisma.$connect();
            console.log(`✅ SUCCESS with ${item.name}!`);
            await prisma.$disconnect();
            return item.url;
        } catch (err: any) {
            console.error(`❌ Failed with ${item.name}:`, err.message || err);
            await prisma.$disconnect().catch(() => {});
        }
    }
}

testConnection().then((workingUrl) => {
    if (workingUrl) {
        console.log('\n🌟 Working URL:', workingUrl);
    } else {
        console.log('\n❌ None of the variants could reach the database. Check Neon dashboard if project is paused or network IP whitelist.');
    }
    process.exit(0);
});
