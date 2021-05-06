import type { RequestHandler } from '@sveltejs/kit';
import { encrypt } from '../utils/crypto';
import { firestore } from '../utils/firebase';

interface Payload {
	publicApiKey: string;
	privateApiKey: string;
	user: string;
}

// POST /index.json
export const post: RequestHandler<{ userid: string; is_new: boolean }, string> = async (
	request
) => {
	try {
		const { publicApiKey, privateApiKey, user } = JSON.parse(request.body) as Payload;

		const { encryptedContent, iv } = encrypt({ content: privateApiKey });

		await firestore.collection('users').doc(user).set({
			publicApiKey,
			privateApiKey: encryptedContent,
			iv
		});

		return {
			status: 200,
			body: 'ok'
		};
	} catch (e) {
		console.error(e);
		return {
			status: 400,
			body: JSON.stringify(e)
		};
	}
};
