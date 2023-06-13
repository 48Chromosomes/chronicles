export type AppStoreInterface = (
	set: (arg0: any) => void,
	get: () => any,
) => {
	chatLogs: ChatLog[];
	character: any;
	narratorList: string[];
	resetChat: () => void;
	resetCharacter: () => void;
	setChatLogs: (log: ChatLog) => void;
	setCharacter: (character: any) => void;
	setNarratorList: (text: string) => void;
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
	visual_description: string;
	roll_dice: boolean;
	story_end: boolean;
}

export interface ChatLog {
	role: 'user' | 'assistant';
	content: string | StorySegment;
}
