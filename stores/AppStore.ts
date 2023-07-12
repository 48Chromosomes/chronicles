import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChatLog, AppStoreInterface } from '@/types';
import { buildNarratorList } from '@/utilities';
import {
	beginGameRequest,
	storyPromptRequest,
	getBackgroundImage,
	getCharacterImage,
	getCharacterRequest,
	getLiveChats,
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
	standby: false,
	nextAction: '',
	toggleStandby: () => {
		const { standby } = get();
		set({ standby: !standby });
	},
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
			background: '/images/background.jpeg',
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
			setNextAction,
			narrationEnd,
			performNextAction,
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

		const nextAction =
			response.story.includes('D20') === true ? 'ROLL_DICE' : 'COUNTDOWN';

		setNextAction(nextAction);

		const newChatLog = { role: 'assistant', content: response };

		setChatLogs(newChatLog);

		sendBackgroundImagePrompt({
			chatLogs: [...chatLogs, newChatLog],
		});

		setWaiting(false);

		setNarratorList(response.story);

		await narrationEnd();

		performNextAction();
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
			narrationEnd,
			setNextAction,
			performNextAction,
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
			const nextAction = response.story.includes('D20')
				? 'ROLL_DICE'
				: 'COUNTDOWN';

			setNextAction(nextAction);

			const newChatLog = { role: 'assistant', content: response };

			setChatLogs(newChatLog);

			setWaiting(false);

			sendBackgroundImagePrompt({
				chatLogs: [...chatLogs, newChatLog],
			});

			setNarratorList(response.story);

			await narrationEnd();

			performNextAction();
		}
	},
	sendBackgroundImagePrompt: async ({ chatLogs }: { chatLogs: ChatLog[] }) => {
		const background = await getBackgroundImage({ chatLogs });
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
	setNextAction: (nextAction: string) => {
		set({ nextAction });
	},
	performNextAction: () => {
		const { nextAction, rollDice, setCountdown } = get();

		if (nextAction === 'ROLL_DICE') {
			rollDice(true);
		} else if (nextAction === 'COUNTDOWN') {
			setCountdown(true);
		}
	},
});

export const useAppStore = create(
	persist(AppStore, {
		name: 'AppStore',
	}),
);
