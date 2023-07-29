import React, { useEffect, useState } from 'react';

import Screen from '@/components/Stage/Screen/Screen';

import { useAppStore } from '@/stores/AppStore';

import { ChatLog } from '@/types';

export default function Replay() {
	const {
		replayIndex,
		setReplayIndex,
		chatLogs,
		setNarratorList,
		narrationEnd,
		setBackgroundImage,
		forceRollDice,
	} = useAppStore();

	useEffect(() => {
		(async () => {
			const playLog: ChatLog | undefined = chatLogs.find(
				(log) => log.content.index === replayIndex,
			);

			console.log('playFrom', playLog);
			console.log('replayIndex', replayIndex);

			if (replayIndex !== -1 && playLog) {
				let index = replayIndex;

				if (playLog.role === 'user' && playLog.content.author) {
					setNarratorList(`${playLog.content.author} has been chosen.`);
				}

				if (playLog.content.image) {
					setBackgroundImage(playLog.content.image);
				}

				if (playLog.content.story.includes('I rolled')) {
					const diceRoll = playLog.content.story.split('I rolled')[1].trim();
					forceRollDice(Number(diceRoll));
				}

				await setNarratorList(playLog.content.story);

				await narrationEnd();

				console.log(index++);

				setReplayIndex(index++);
			}
		})();
	}, [replayIndex]);

	return (
		<>
			<Screen />
		</>
	);
}
