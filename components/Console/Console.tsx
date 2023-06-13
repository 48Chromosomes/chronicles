import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './Console.module.scss';

import { useAppStore } from '@/stores/AppStore';
import { api } from '@/utilities/server';
import { ChatLog } from '@/types';

export default function Console() {
	const { character, chatLogs, setChatLogs } = useAppStore();
	const messageListRef = useRef<HTMLDivElement>(null);
	const textInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [query, setQuery] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		textInputRef.current?.focus();
	}, []);

	const onSubmit = async (event?: React.SyntheticEvent | undefined) => {
		event?.preventDefault();

		const prompt = query.trim();

		if (prompt.length === 0) return;

		setLoading(true);
		setQuery('');

		setChatLogs({ role: 'user', content: prompt });

		try {
			const response: ChatLog = await api({
				endpoint: '/chronicles/prompt',
				method: 'POST',
				body: {
					prompt,
					chatLogs,
					character,
				},
			});

			setChatLogs(response);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log('error', error);
		}
	};

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setQuery(event.target.value);

	return (
		<>
			<div className={styles.consoleContainer}>
				<div className={styles.chatLogContainer} ref={messageListRef}>
					{chatLogs &&
						[...chatLogs].reverse().map((log: ChatLog, index: number) => (
							<div key={index} className={styles.log}>
								{typeof log.content === 'object'
									? log.content.story
									: log.content}
							</div>
						))}

					{loading && (
						<Image
							className={styles.loader}
							src="/images/ellipsis.gif"
							alt="ellipis"
							width={50}
							height={50}
						/>
					)}
				</div>

				<div className={styles.formContainer}>
					<form className={styles.form} onSubmit={onSubmit} ref={formRef}>
						<input
							ref={textInputRef}
							type="text"
							className={styles.promptText}
							value={query}
							name="text"
							onChange={onChange}
						/>

						<button className={styles.button} type="submit">
							<Image src="/images/send.svg" alt="Send" width={20} height={20} />
						</button>
					</form>
				</div>
			</div>
		</>
	);
}
