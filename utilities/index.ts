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

export const weightedRandom = () => {
	let max = 20;
	let bias = 1.2;

	let randomNumber = Math.floor((1 - Math.pow(Math.random(), bias)) * max) + 1;

	return randomNumber;
};
