const fs = require('fs');
require('dotenv').config();

async function updateAvatar() {
	const token = process.env.BOT_TOKEN;

	if (!token)
		throw new Error('No token provided!');

    try {
        const newAvatar = fs.readFileSync('r2d2.gif');
        const response = await fetch('https://discord.com/api/v9/users/@me', {
            method: 'PATCH',
            headers: {
                Authorization: `Bot ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: `data:image/gif;base64,${newAvatar.toString('base64')}`
            })
        });

        if (response.ok) {
            console.log('Successfully set the avatar!');
        } else {
            const responseBody = await response.text();
            console.error('Failed to patch avatar:', response.statusText);
            console.error('Response:', responseBody);
        }
    } catch (error) {
        console.error('Exception catch while patching with new avatar', error);
    }
}

updateAvatar();