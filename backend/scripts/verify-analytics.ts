import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { ClickRepository } from '../src/repositories/click.repository';

async function main() {
    const prisma = new PrismaClient();
    const clickRepository = new ClickRepository(prisma);

    try {
        // Find a user to test with
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found to test with. Skipping verification.');
            return;
        }

        console.log(`Testing with user ID: ${user.id}`);
        const since = new Date();
        since.setDate(since.getDate() - 30); // Look back 30 days

        const result = await clickRepository.findUserDailyClicks(user.id, since);
        console.log('Result from findUserDailyClicks:');
        console.log(JSON.stringify(result, null, 2));

        if (!Array.isArray(result)) {
            console.error('FAILED: Result is not an array');
            process.exit(1);
        }
        console.log('SUCCESS: Method executed without error and returned an array.');

    } catch (error) {
        console.error('FAILED: Error during execution:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
