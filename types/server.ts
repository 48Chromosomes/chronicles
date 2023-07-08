import { ChatLog, Character, StorySegment } from '@/types';

export type FetchParams = {
	endpoint: string;
	method: 'GET' | 'POST';
	body?: any;
};

export type BeginGameParams = {
	prompt: StorySegment;
	chatLogs: ChatLog[];
	character: Character;
};

export type StoryPromptParams = {
	prompt: string;
	chatLogs: ChatLog[];
	character: Character;
};

export type GetImageParams = {
	chatLogs?: ChatLog[];
	prompt?: string;
};
