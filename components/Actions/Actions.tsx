import { useState } from 'react';
import styles from './Actions.module.scss';

import { useAppStore } from '@/stores/AppStore';
import { api } from '@/utilities/server';

import Button from './Button/Button';
import Loading from './Loading/Loading';
import { ChatLog } from '@/types';

export default function Actions() {
	const {
		character,
		chatLogs,
		setCharacter,
		resetCharacter,
		setChatLogs,
		setNarratorList,
	} = useAppStore();
	const [loading, setLoading] = useState<boolean>(false);

	const getCharacter = async () => {
		setLoading(true);

		const chatacter = await api({
			endpoint: '/chronicles/character',
			method: 'GET',
		});

		setCharacter(chatacter);
		setLoading(false);
	};

	const beginGame = async () => {
		setLoading(true);

		const response = await api({
			endpoint: '/chronicles/prompt',
			method: 'POST',
			body: {
				prompt: 'Begin game',
				chatLogs,
				character,
			},
		});

		setChatLogs({ role: 'assistant', content: response });
		setLoading(false);
	};

	const triggerNarration = async () => {
		let lastLog: ChatLog = chatLogs[chatLogs.length - 1];
		if (typeof lastLog.content === 'object')
			setNarratorList(lastLog.content.story);
	};

	return (
		<div className={styles.actionsContainer}>
			<div className={styles.actions}>
				{loading && <Loading />}

				<Button
					label="Get Character"
					onClick={getCharacter}
					disabled={character}
				/>

				<Button
					label="Reset Character"
					onClick={resetCharacter}
					disabled={!character}
				/>

				<Button
					label="Begin Game"
					onClick={beginGame}
					disabled={chatLogs.length !== 0 || !character}
				/>

				<Button label="Trigger Narration" onClick={triggerNarration} />
			</div>
		</div>
	);
}
