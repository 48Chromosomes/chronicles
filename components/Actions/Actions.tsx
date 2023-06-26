import React, { useEffect, useState } from 'react';
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
		setNarrating,
		toggleMusic,
		setCountdown,
		streamId,
		setStreamId,
		stageDimensions,
	} = useAppStore();
	const [loading, setLoading] = useState<boolean>(false);
	const [shouldShowStartRecordingModal, setShouldShowStartRecordingModal] =
		useState<boolean>(false);
	const [webRTCAdaptor, setWebRTCAdaptor] = useState<WebRTCAdaptor | null>(
		null,
	);

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

	const startCountdown = () => setCountdown(true);

	const startRecording = async (streamId: string) => {
		setStreamId(streamId);
		setShouldShowStartRecordingModal(false);

		const webRTCAdaptorObject = new WebRTCAdaptor({
			websocket_url: 'ws://35.159.22.210:5080/WebRTCAppEE/websocket',
		});

		await setWebRTCAdaptor(webRTCAdaptorObject);

		webRTCAdaptor?.publish(streamId);
		webRTCAdaptor?.switchDesktopCapture(streamId);
	};

	const showStartRecordingModal = () => setShouldShowStartRecordingModal(true);

	const openStage = () => {
		const { width, height } = stageDimensions;
		const windowFeatures = `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${
			Number(height) + 90
		}`;

		window.open('http://localhost:3000/live', '_blank', windowFeatures);
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

				<Button label="Trigger Narration" onClick={triggerNarration} />

				<Button label="Stop Narration" onClick={stopNarration} />

				<Button label="Get background" onClick={getBackgroundImage} />

				<Button label="Roll dice" onClick={rollDiceAction} />

				<Button label="Toggle waiting" onClick={toggleWaiting} />

				<Button label="Toggle music" onClick={changeMusic} />

				<Button label="Start countdown" onClick={startCountdown} />
			</div>

			<div className={styles.liveContainer}>
				<Button label="Start recording" onClick={showStartRecordingModal} />
				<Button label="Open stage" onClick={openStage} />
			</div>

			<Modal
				text="Input stream ID"
				buttonLabel="Start"
				shouldCollectValue={true}
				defaultValue={streamId}
				visible={shouldShowStartRecordingModal}
				callback={startRecording}
				onClose={() => setShouldShowStartRecordingModal(false)}
			/>
		</div>
	);
}
