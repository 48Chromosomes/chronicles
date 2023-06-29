import React, { useState } from 'react';
import styles from './Actions.module.scss';

import { WebRTCAdaptor } from '@/utilities/antmedia';
import { useAppStore } from '@/stores/AppStore';

import Button from './Button/Button';
import Loading from './Loading/Loading';
import Modal from './Modal/Modal';
import { ChatLog } from '@/types';

export default function Actions() {
	const {
		character,
		countdown,
		chatLogs,
		narrating,
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
		setNarrating,
		toggleMusic,
		setCountdown,
		videoId,
		setVideoId,
		updateLiveChats,
	} = useAppStore();
	const [loading, setLoading] = useState<boolean>(false);
	const [shouldShowVideoIdModal, setShouldShowVideoIdModal] =
		useState<boolean>(false);

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

	const stopNarration = () => setNarrating(false);

	const changeMusic = () => toggleMusic();

	const toggleCountdown = () => setCountdown(!countdown);

	const setVideoIdStore = async (videoId: string) => {
		setVideoId(videoId);
		setShouldShowVideoIdModal(false);
	};

	const showVideoIdModal = () => setShouldShowVideoIdModal(true);

	const selectLiveChat = () => {
		updateLiveChats();
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

				<Button
					label="Trigger Narration"
					onClick={triggerNarration}
					disabled={narrating}
				/>

				<Button
					label="Stop Narration"
					onClick={stopNarration}
					disabled={!narrating}
				/>

				<Button label="Get background" onClick={getBackgroundImage} />

				<Button label="Roll dice" onClick={rollDiceAction} />

				<Button label="Toggle waiting" onClick={toggleWaiting} />

				<Button label="Toggle music" onClick={changeMusic} />

				<Button label="Toggle countdown" onClick={toggleCountdown} />

				<Button label="Select live chat" onClick={selectLiveChat} />
			</div>

			<div className={styles.liveContainer}>
				<Button label="Set Video ID" onClick={showVideoIdModal} />
			</div>

			<Modal
				text="Input video ID"
				buttonLabel="Set"
				shouldCollectValue={true}
				defaultValue={videoId}
				visible={shouldShowVideoIdModal}
				callback={setVideoIdStore}
				onClose={() => setShouldShowVideoIdModal(false)}
			/>
		</div>
	);
}
