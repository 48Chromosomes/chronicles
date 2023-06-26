import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

import styles from './Console.module.scss';

import CharacterImage from './CharacterImage/CharacterImage';

import { useAppStore } from '@/stores/AppStore';
import { ChatLog } from '@/types';

export default function Console() {
	const { character, chatLogs, setChatLogs, sendStoryPrompt, waiting } =
		useAppStore();
	const messageListRef = useRef<HTMLDivElement>(null);
	const textInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [query, setQuery] = useState<string>('');

	useEffect(() => {
		textInputRef.current?.focus();
	}, []);

	const onSubmit = async (event?: React.SyntheticEvent | undefined) => {
		event?.preventDefault();

		const prompt = query.trim();

		if (prompt.length === 0) return;

		setQuery('');

		setChatLogs({ role: 'user', content: { story: prompt } });

		try {
			await sendStoryPrompt({ prompt });
		} catch (error) {
			console.log('error', error);
		}
	};

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setQuery(event.target.value);

	return (
		<>
			<div className={styles.consoleContainer}>
				{character && <CharacterImage />}

				<div className={styles.chatLogContainer} ref={messageListRef}>
					{waiting && (
						<Image
							className={styles.loader}
							src="/images/ellipsis.gif"
							alt="ellipis"
							width={50}
							height={50}
						/>
					)}

					{chatLogs &&
						[...chatLogs].reverse().map((log: ChatLog, index: number) => (
							<div key={index}>
								<div className={styles.log}>{log.content?.story}</div>

								{log.content?.roll_dice && (
									<div className={styles.roll}>Dice roll required</div>
								)}
							</div>
						))}
				</div>

				<div className={styles.formContainer}>
					<form
						className={styles.form}
						onSubmit={onSubmit}
						ref={formRef}
						autoComplete="off"
					>
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
