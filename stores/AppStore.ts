import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChatLog, AppStoreInterface, StageDimensions } from '@/types';
import { buildNarratorList } from '@/utilities/narration';
import {
	beginGameRequest,
	storyPromptRequest,
	getBackgroundImage,
	getCharacterImage,
	getCharacterRequest,
	getLiveChats,
	getIntro,
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
	playMusic: false,
	countdown: false,
	liveChats: [],
	videoId: '',
	toggleMusic: () => {
		const { playMusic } = get();
		set({ playMusic: !playMusic });
	},
	setWaiting: (waiting: boolean) => {
		set({ waiting });
	},
	setCountdown: (countdown: boolean) => {
		set({ countdown });
	},
	resetChat: () =>
		set({
			chatLogs: [],
			roll: false,
			narrating: false,
			narratorList: [],
			waiting: false,
			playMusic: false,
			countdown: false,
			liveChats: [],
		}),
	resetCharacter: () =>
		set({
			character: null,
			characterImage: '',
		}),
	setChatLogs: ({ role, content }: ChatLog) => {
		set((state: any) => ({
			chatLogs: [...state.chatLogs, { role, content }],
		}));
	},
	setCharacter: (character: any) => {
		set({ character });
	},
	setNarratorList: async (text: string) => {
		const { narrationEnd } = get();

		await narrationEnd();

		const narratorList = buildNarratorList(text);
		set({ narratorList });
	},
	setNarrating: (narrating: boolean) => {
		set({ narrating, ...(narrating ? {} : { narratorList: [] }) });
	},
	sendIntroPrompt: async () => {},
	sendBeginGamePrompt: async () => {
		const {
			chatLogs,
			character,
			setWaiting,
			setChatLogs,
			setNarratorList,
			sendBackgroundImagePrompt,
			toggleMusic,
		} = get();

		setNarratorList('Let us begin..');

		toggleMusic();

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
			rollDice,
			narrationEnd,
			setCountdown,
		} = get();

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
		} else {
			setChatLogs({ role: 'assistant', content: response });

			setWaiting(false);

			sendBackgroundImagePrompt({ prompt: response.visual_description });

			setNarratorList(response.story);

			await narrationEnd();

			if (response.roll_dice) {
				rollDice(true);
			} else {
				setCountdown(true);
			}
		}
	},
	sendBackgroundImagePrompt: async ({ prompt }: { prompt: string }) => {
		const background = await getBackgroundImage({ prompt });
		set({ background });
	},
	rollDice: (shouldRoll: boolean) => {
		set({ roll: shouldRoll });
	},
	narrationEnd: async () => {
		await new Promise((resolve) => {
			const interval = setInterval(() => {
				const { narrating } = get();

				if (!narrating) {
					resolve(true);
					clearInterval(interval);
				}
			}, 3000);
		});
	},
	updateLiveChats: async () => {
		const { videoId } = get();

		if (videoId === '') {
			console.warn('WARNING: No video ID provided.');
		} else {
			const liveChats = await getLiveChats({ videoId });
			set({ liveChats });
		}
	},
	setVideoId: (videoId: string) => {
		set({ videoId });
	},
	getGameIntro: async () => {
		const { character, setChatLogs } = get();

		const { intro }: { intro: string } = await getIntro({ character });

		await setChatLogs({ role: 'assistant', content: { story: intro } });

		return intro;
	},
});

export const useAppStore = create(
	persist(AppStore, {
		name: 'AppStore',
	}),
);
