export type AppStoreInterface = (
	set: (arg0: any) => void,
	get: () => any,
) => {
	background: string;
	chatLogs: ChatLog[];
	character: any;
	countdown: boolean;
	characterImage: string;
	roll: boolean;
	narratorList: string[];
	narrating: boolean;
	waiting: boolean;
	playMusic: boolean;
	liveChats: any[];
	videoId: string;
	standby: boolean;
	setCountdown: (countdown: boolean) => void;
	toggleMusic: () => void;
	setWaiting: (waiting: boolean) => void;
	resetChat: () => void;
	resetCharacter: () => void;
	getCharacterAssets: () => void;
	getCharacterImage: () => void;
	setNarrating: (narrating: boolean) => void;
	setCharacterImage: (characterImage: string) => void;
	setChatLogs: (log: ChatLog) => void;
	setNarratorList: (text: string) => void;
	sendBeginGamePrompt: () => void;
	sendStoryPrompt: ({ prompt }: { prompt: string }) => void;
	sendBackgroundImagePrompt: ({ prompt }: { prompt: string }) => void;
	rollDice: (shouldRoll: boolean) => void;
	updateLiveChats: () => void;
	setVideoId: (videoId: string) => void;
	toggleStandby: () => void;
};

export interface Character {
	alignment: string;
	background: string;
	class: string;
	equipment: string[];
	name: string;
	sex: string;
	proficiencies: string[];
	race: string;
	stats: {
		charisma: number;
		constitution: number;
		dexterity: number;
		intelligence: number;
		strength: number;
		wisdom: number;
	};
}

export interface StorySegment {
	story: string;
	visual_description?: string;
	roll_dice?: boolean;
	story_end?: boolean;
}

export interface ChatLog {
	role: 'user' | 'assistant';
	content: StorySegment;
}

export interface LiveChat {
	message: string;
	username: string;
	timestamp: string;
	includesTaggedUser: boolean;
}

export interface StageDimensions {
	width?: number;
	height?: number;
	offsetX?: number;
	offsetY?: number;
	screenWidth?: number;
	screenHeight?: number;
}
