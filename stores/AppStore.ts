import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ChatLog, AppStoreInterface } from '@/types';
import { buildNarratorList } from '@/utilities/narration';

export const AppStore: AppStoreInterface = (
	set: (arg0: any) => void,
	get: () => any,
) => ({
	chatLogs: [],
	character: null,
	narratorList: [],
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
});

export const useAppStore = create(
	persist(AppStore, {
		name: 'AppStore',
	}),
);
