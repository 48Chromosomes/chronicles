import { split, splitOptions } from 'sentence-splitter';

export const buildNarratorList = (text: string) => {
	const options: splitOptions = {
		SeparatorParser: {
			separatorCharacters: ['.', '?', '!'],
		},
	};

	const sentences = split(text, options);

	const sentenceRawArray = sentences
		.filter((sentence) => sentence.type === 'Sentence')
		.map((sentence) => sentence.raw);

	return sentenceRawArray;
};
