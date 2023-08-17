import React, { useEffect } from 'react';

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

			if (replayIndex !== -1 && playLog) {
				if (playLog.content.image) {
					setBackgroundImage(playLog.content.image);
				}

				if (playLog.content.story.includes('I rolled')) {
					const diceRoll = playLog.content.story.split('I rolled')[1].trim();
					forceRollDice(Number(diceRoll));
					await rollDice(true);
					await new Promise((resolve) => setTimeout(resolve, 5000));
					await narrationEnd();
				} else {
					const story = playLog.content.story.replace(
						'Tag @48 Chronicles in the livechat with your next move - anyone is welcome to play',
						'',
					);

					const segmentString =
						playLog.role === 'user' && playLog.content.author
							? `${playLog.content.author} was chosen from the livechat. ${story}`
							: story;

					await setNarratorList(segmentString);
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
