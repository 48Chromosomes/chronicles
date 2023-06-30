import React, { useState } from 'react';
import styles from './Actions.module.scss';

import { useAppStore } from '@/stores/AppStore';

import Button from './Button/Button';
import Loading from './Loading/Loading';
import Modal from './Modal/Modal';
import Divider from './Divider/Divider';

import {
	cancelAllRequests,
	synthesizeSpeech,
	getIntro,
	getOutro,
} from '@/utilities/server';
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
		setChatLogs,
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

	const cancelAll = () => {
		cancelAllRequests();
		setNarrating(false);
		setCountdown(false);
		setWaiting(false);
	};

	const getIntroSpeech = async () => {
		setLoading(true);
		const { intro }: { intro: string } = await getIntro({ character });
		setLoading(false);
		await setChatLogs({ role: 'assistant', content: { story: intro } });
		playAudio(intro);
	};

	const getOutroSpeech = async () => {
		setLoading(true);
		const { outro }: { outro: string } = await getOutro();
		setLoading(false);
		await setChatLogs({ role: 'assistant', content: { story: outro } });
		playAudio(outro);
	};

	const playAudio = async (text: string) => {
		const blob = await synthesizeSpeech({ text });
		const url = URL.createObjectURL(blob);
		const audio = new Audio(url);
		audio.play();
	};

	return (
		<div className={styles.actionsContainer}>
			<div className={styles.actions}>
				{loading && <Loading />}

				<Divider label="Game" />

				<Button
					label="Begin Game"
					onClick={beginGame}
					disabled={chatLogs.length !== 1 || !character}
				/>

				<Button
					label="Get intro"
					onClick={getIntroSpeech}
					disabled={!character}
				/>

				<Button
					label="Get outro"
					onClick={getOutroSpeech}
					disabled={!character}
				/>

				<Button
					label="Reset Story"
					onClick={resetStory}
					disabled={chatLogs.length === 0}
				/>

				<Divider label="Controls" />

				<Button label="Get background" onClick={getBackgroundImage} />

				<Button label="Roll dice" onClick={rollDiceAction} />

				<Button label="Toggle waiting" onClick={toggleWaiting} />

				<Button label="Toggle music" onClick={changeMusic} />

				<Button label="Toggle countdown" onClick={toggleCountdown} />

				<Button label="Select live chat" onClick={selectLiveChat} />

				<Button label="Cancel requests" onClick={cancelAll} />

				<Divider label="Character" />

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

				<Divider label="Narrator" />

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
