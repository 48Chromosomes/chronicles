import React, { useEffect, useRef } from 'react';

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
		rollDice,
	} = useAppStore();

	useEffect(() => {
		(async () => {
			const playLog: ChatLog | undefined = chatLogs.find(
				(log) => log.content.index === replayIndex,
			);

			console.log(replayIndex);

			if (replayIndex !== -1 && playLog) {
				if (playLog.role === 'user' && playLog.content.author) {
					setNarratorList(
						`${playLog.content.author} was chosen from the livechat.`,
					);
				}

				if (playLog.content.image) {
					setBackgroundImage(playLog.content.image);
				}

				if (playLog.content.story.includes('I rolled')) {
					const diceRoll = playLog.content.story.split('I rolled')[1].trim();
					forceRollDice(Number(diceRoll));
					await rollDice(true);
					await narrationEnd();
				} else {
					await setNarratorList(playLog.content.story);
					await narrationEnd();
				}

				if (replayIndex === chatLogs.length - 1) setReplayIndex(-1);
				else setReplayIndex(replayIndex + 1);
			}
		})();
	}, [replayIndex]);

	return (
		<>
			<Screen />
		</>
	);
}
