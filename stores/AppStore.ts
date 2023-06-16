import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChatLog, AppStoreInterface } from '@/types';
import { buildNarratorList } from '@/utilities/narration';
import {
	beginGameRequest,
	storyPromptRequest,
	getBackgroundImage,
	getCharacterImage,
	getCharacterRequest,
} from '@/utilities/server';

export const AppStore: AppStoreInterface = (
	set: (arg0: any) => void,
	get: () => any,
) => ({
	background: '/images/background.jpeg',
	chatLogs: [],
	character: null,
	characterImage: '',
	roll: false,
	narrating: false,
	narratorList: [],
	waiting: false,
	setWaiting: (waiting: boolean) => {
		set({ waiting });
	},
	resetChat: () =>
		set({
			chatLogs: [],
		}),
	resetCharacter: () =>
		set({
			character: null,
		}),
	setChatLogs: ({ role, content }: ChatLog) => {
		set((state: any) => ({
			chatLogs: [...state.chatLogs, { role, content }],
		}));
	},
	setCharacter: (character: any) => {
		set({ character });
	},
	setNarratorList: (text: string) => {
		const narratorList = buildNarratorList(text);
		set({ narratorList });
	},
	setNarrating: (narrating: boolean) => {
		set({ narrating });
	},
	sendBeginGamePrompt: async () => {
		const {
			chatLogs,
			character,
			setWaiting,
			setChatLogs,
			setNarratorList,
			sendBackgroundImagePrompt,
		} = get();

		setTimeout(() => setNarratorList('Let us begin..'), 2000);

		setWaiting(true);

		const prompt = { story: 'Begin game' };

		setChatLogs({ role: 'user', content: prompt });

		const response = await beginGameRequest({
			prompt,
			chatLogs,
			character,
		});

		setChatLogs({ role: 'assistant', content: response });

		sendBackgroundImagePrompt({ prompt: response.visual_description });

		setNarratorList(response.story);

		setWaiting(false);
	},
	getCharacterAssets: async () => {
		const { getCharacterImage } = get();

		const character = await getCharacterRequest();

		set({ character });

		getCharacterImage();
	},
	getCharacterImage: async () => {
		const { character } = get();

		const prompt = [
			character.alignment,
			character.class,
			character.background,
			character.race,
			character.sex,
			...character.equipment,
			'waist up',
			'in-frame',
		].join(', ');

		const characterImage = await getCharacterImage({ prompt });
		set({ characterImage });
	},
	setCharacterImage: (characterImage: string) => {
		set({ characterImage });
	},
	sendStoryPrompt: async ({ prompt }: { prompt: string }) => {
		const {
			chatLogs,
			character,
			setWaiting,
			setChatLogs,
			sendBackgroundImagePrompt,
			setNarratorList,
		} = get();

		setTimeout(() => setNarratorList(`You choose to ${prompt}`), 2000);

		setWaiting(true);

		const response = await storyPromptRequest({
			prompt,
			chatLogs,
			character,
		});

		if (response.error) {
			console.warn(
				'WARNING: Error occurred fetching response: ',
				response.error,
			);
		} else if (typeof response !== 'object') {
			console.warn('WARNING: Response was not an object: ', response.error);

			setChatLogs({
				role: 'assistant',
				content: {
					story: response,
					visual_description: '',
					roll_dice: false,
					story_end: false,
				},
			});

			setNarratorList(response);
		} else {
			setChatLogs({ role: 'assistant', content: response });

			sendBackgroundImagePrompt({ prompt: response.visual_description });

			setNarratorList(response.story);
		}

		setWaiting(false);

		// Trigger dice roll
	},
	sendBackgroundImagePrompt: async ({ prompt }: { prompt: string }) => {
		const background = await getBackgroundImage({ prompt });
		set({ background });
	},
	rollDice: (shouldRoll: boolean) => {
		set({ roll: shouldRoll });
	},
});

export const useAppStore = create(
	persist(AppStore, {
		name: 'AppStore',
	}),
);
