import React, { useState, useEffect } from 'react';

import styles from './Spinner.module.scss';

import { LiveChat } from '@/types';

import { useAppStore } from '@/stores/AppStore';

export default function Spinner() {
	const {
		liveChats,
		sendStoryPrompt,
		setNarratorList,
		setChatLogs,
		shouldSelectLiveChat,
		setShouldSelectLiveChat,
	} = useAppStore();
	const [chosenChat, setChosenChat] = useState<LiveChat | null>(null);
	const [lastPlayer, setLastPlayer] = useState<string | null>(null);

	useEffect(() => {
		if (liveChats.length > 0 && shouldSelectLiveChat) {
			const chatsWithTaggedUser = liveChats.filter(
				(object) => object.includesTaggedUser,
			);

			const randomIndex = Math.floor(
				Math.random() * chatsWithTaggedUser.length,
			);

			const chosenChat = chatsWithTaggedUser[randomIndex];

			setChosenChat(chosenChat);
			setShouldSelectLiveChat(false);
		}
	}, [liveChats]);

	/* useEffect(() => {
		let lastChatsOfEachUser: LiveChat[] = [];

		// filter out the chats that have been overwritten by a new message from the same user
		liveChats.reduce((acc, chat) => {
			acc[chat.username] = chat;
			return acc;
		}, lastChatsOfEachUser);

		// filter out the last player from the selection
		if (lastPlayer) {
			lastChatsOfEachUser = lastChatsOfEachUser.filter(
				(chat) => chat.username !== lastPlayer,
			);
		}

		// filter out the chats that don't include a tagged user
		const chatsWithTaggedUser = lastChatsOfEachUser.filter(
			(object) => object.includesTaggedUser,
		);

		if (chatsWithTaggedUser.length > 0) {
			const randomIndex = Math.floor(
				Math.random() * chatsWithTaggedUser.length,
			);

			const chosenChat = chatsWithTaggedUser[randomIndex];

			setChosenChat(chosenChat);
			setLastPlayer(chosenChat.username);
		}
	}, [liveChats]); */

	useEffect(() => {
		if (chosenChat) {
			const trimmedMessage = chosenChat.message.replace(
				/@(48 Chronicles|48C|48c)\s*/gi,
				'',
			);

			setChatLogs({
				role: 'user',
				content: { story: trimmedMessage, author: chosenChat.username },
			});

			sendStoryPrompt({ prompt: trimmedMessage });

			setNarratorList(
				`${chosenChat.username} has been chosen. ${trimmedMessage}`,
			);
		}
	}, [chosenChat]);

	return <div className={styles.spinnerContainer}></div>;
}
