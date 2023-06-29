import React, { useState, useEffect } from 'react';

import styles from './Spinner.module.scss';

import { LiveChat } from '@/types';

import { useAppStore } from '@/stores/AppStore';

export default function Spinner() {
	const { liveChats, sendStoryPrompt, setNarratorList, setChatLogs } =
		useAppStore();
	const [chosenChat, setChosenChat] = useState<LiveChat | null>(null);

	useEffect(() => {
		const uniqueUsernames = Array.from(
			new Set(liveChats.map((object) => object.username)),
		);

		const uniqueChats = liveChats.filter((object) =>
			uniqueUsernames.includes(object.username),
		);

		const chatsWithTaggedUser = uniqueChats.filter(
			(object) => object.includesTaggedUser,
		);

		const randomIndex = Math.floor(Math.random() * chatsWithTaggedUser.length);

		setChosenChat(chatsWithTaggedUser[randomIndex]);
	}, [liveChats]);

	useEffect(() => {
		if (chosenChat) {
			const trimmedMessage = chosenChat.message.replace(
				/^@48 Chronicles\s*/,
				'',
			);

			setChatLogs({ role: 'user', content: { story: trimmedMessage } });

			sendStoryPrompt({ prompt: trimmedMessage });

			setNarratorList(
				`${chosenChat.username} has been chosen. ${trimmedMessage}`,
			);
		}
	}, [chosenChat]);

	return <div className={styles.spinnerContainer}></div>;
}
