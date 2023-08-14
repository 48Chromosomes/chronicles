import { Character } from '@/types';
import {
	FetchParams,
	BeginGameParams,
	StoryPromptParams,
	GetImageParams,
} from '@/types/server';

const url = process.env.NEXT_PUBLIC_APP_URL;

const abortControllers: AbortController[] = [];

const api = async ({ endpoint, method, body }: FetchParams) => {
	const controller = new AbortController();

	abortControllers.push(controller);

	const signal = controller.signal;

	try {
		const response: Response = await fetch(`${url}${endpoint}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			signal,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		return typeof data === 'object' ? data : JSON.parse(data);
	} catch (error) {
		console.warn(
			`An error occurred while making an API call to ${endpoint}: ${error}`,
		);
		return null;
	}
};

export const cancelAllRequests = async () => {
	abortControllers.forEach((controller) => controller.abort());
};

export const beginGameRequest = async ({
	prompt,
	chatLogs,
	character,
}: BeginGameParams) => {
	const response = await api({
		endpoint: '/chronicles/prompt',
		method: 'POST',
		body: {
			prompt,
			chatLogs,
			character,
		},
	});

	return response;
};

export const getCharacterRequest = async () => {
	const response = await api({
		endpoint: '/chronicles/character',
		method: 'GET',
	});

	return response;
};

export const getCharacterImage = async ({ prompt }: GetImageParams) => {
	const image = await api({
		endpoint: '/chronicles/image',
		method: 'POST',
		body: {
			prompt,
			width: 768,
			height: 1024,
		},
	});

	return image.url;
};

export const storyPromptRequest = async ({
	prompt,
	chatLogs,
	character,
}: StoryPromptParams) => {
	const filteredChatLogs =
		chatLogs.length <= 70
			? chatLogs
			: [...chatLogs.slice(0, 20), ...chatLogs.slice(-50)];

	console.log('Filtered chat log length: ', filteredChatLogs.length);

	const response = await api({
		endpoint: '/chronicles/prompt',
		method: 'POST',
		body: {
			prompt,
			chatLogs: filteredChatLogs,
			character,
		},
	});

	return response;
};

export const getBackgroundImage = async ({ chatLogs }: GetImageParams) => {
	const image = await api({
		endpoint: '/chronicles/image',
		method: 'POST',
		body: {
			chatLogs,
			width: 1024,
			height: 768,
		},
	});

	if (!image.error) {
		return image.url;
	}
};

export const synthesizeSpeech = async ({ text }: { text: string }) => {
	const response: Response = await fetch(`${url}/chronicles/synthesize`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			text,
		}),
	});

	const audio: Blob = await response.blob();

	return audio;
};

export const synthesizeSpeechElevenLabs = async ({
	text,
}: {
	text: string;
}) => {
	const response: Response = await fetch(`${url}/chronicles/elevenlabs`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			text,
		}),
	});

	const audio: Blob = await response.blob();

	return audio;
};

export const getLiveChats = async ({ videoId }: { videoId: string }) => {
	const response = await api({
		endpoint: '/chronicles/livechat',
		method: 'POST',
		body: {
			videoId,
		},
	});

	return response.messages;
};

export const getIntro = async ({ character }: { character: Character }) => {
	const response = await api({
		endpoint: '/chronicles/intro',
		method: 'POST',
		body: {
			character,
		},
	});

	return response;
};

export const getOutro = async () => {
	const response = await api({
		endpoint: '/chronicles/outro',
		method: 'GET',
	});

	return response;
};
