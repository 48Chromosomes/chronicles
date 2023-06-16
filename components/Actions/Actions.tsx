import { useState } from 'react';
import styles from './Actions.module.scss';

import { useAppStore } from '@/stores/AppStore';

import Button from './Button/Button';
import Loading from './Loading/Loading';
import { ChatLog } from '@/types';

export default function Actions() {
	const {
		character,
		chatLogs,
		waiting,
		getCharacterAssets,
		getCharacterImage,
		resetChat,
		resetCharacter,
		setNarratorList,
		sendBeginGamePrompt,
		sendBackgroundImagePrompt,
		rollDice,
		setWaiting,
	} = useAppStore();
	const [loading, setLoading] = useState<boolean>(false);

	const getCharacter = async () => {
		setLoading(true);
		await getCharacterAssets();
		setLoading(false);
	};

	const refreshCharacterImage = async () => {
		setLoading(true);
		await getCharacterImage();
		setLoading(false);
	};

	const beginGame = async () => {
		setLoading(true);
		await sendBeginGamePrompt();
		setLoading(false);
	};

	const triggerNarration = async () => {
		const lastLog: ChatLog = chatLogs[chatLogs.length - 1];
		setNarratorList(lastLog.content.story);
	};

	const getBackgroundImage = async () => {
		setLoading(true);

		try {
			const lastLog: ChatLog = chatLogs[chatLogs.length - 1];

			await sendBackgroundImagePrompt({
				prompt: lastLog.content.visual_description || 'A fantasy world',
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

	const toggleWaiting = () => setWaiting(!waiting);

	const resetStory = () => resetChat();

	const rollDiceAction = () => rollDice(true);

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
					label="Character Image"
					onClick={refreshCharacterImage}
					disabled={!character}
				/>

				<Button
					label="Reset Story"
					onClick={resetStory}
					disabled={chatLogs.length === 0}
				/>

				<Button
					label="Begin Game"
					onClick={beginGame}
					disabled={chatLogs.length !== 0 || !character}
				/>

				<hr />

				<Button label="Trigger Narration" onClick={triggerNarration} />

				<Button label="Get background" onClick={getBackgroundImage} />

				<Button label="Roll dice" onClick={rollDiceAction} />

				<Button label="Toggle waiting" onClick={toggleWaiting} />
			</div>
		</div>
	);
}
