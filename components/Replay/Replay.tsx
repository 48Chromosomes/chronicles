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
	} = useAppStore();

	useEffect(() => {
		(async () => {
			const playFrom: ChatLog | undefined = chatLogs.find(
				(log) => log.content.index === replayIndex,
			);

			console.log('playFrom', playFrom);
			console.log('replayIndex', replayIndex);

			if (replayIndex !== -1 && playFrom) {
				let index = replayIndex;

				setNarratorList(playFrom.content.story);

				await narrationEnd();

				setReplayIndex(++index);
			} else {
				setReplayIndex(-1);
			}
		})();
	}, [replayIndex]);

	return (
		<>
			<Screen />
		</>
	);
}
