import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';

import styles from './Console.module.scss';

import CharacterImage from './CharacterImage/CharacterImage';

import { useAppStore } from '@/stores/AppStore';
import { ChatLog } from '@/types';

export default function Console() {
	const {
		character,
		chatLogs,
		setChatLogs,
		sendStoryPrompt,
		waiting,
		replayIndex,
		setReplayIndex,
		setNarrating,
		showReplayScreen,
	} = useAppStore();
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

		setChatLogs({
			role: 'user',
			content: { story: prompt, author: 'Based Ape' },
		});

		try {
			await sendStoryPrompt({ prompt });
		} catch (error) {
			console.log('error', error);
		}
	};

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setQuery(event.target.value);

	const stopReplay = () => {
		setReplayIndex(-1);
		setNarrating(false);
	};

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
							<div className={styles.chatLog} key={index}>
								<div
									className={cx(styles.log, {
										[styles.replaying]: replayIndex === log.content.index,
									})}
								>
									{log.content?.story}

									<div className={styles.info}>
										<hr />

										{log.role === 'user' && (
											<>
												<p>
													{log.content?.index} {log.content?.author || 'System'}
												</p>

												{log.content?.image && (
													<div className={styles.image}>
														<Image
															className={styles.imageIcon}
															src="/images/image.png"
															alt="image"
															width={15}
															height={15}
														/>

														<div className={styles.imagePreview}>
															<Image
																src={log.content?.image}
																alt="image"
																width={100}
																height={65}
															/>
														</div>
													</div>
												)}
											</>
										)}

										{log.role === 'assistant' && (
											<p>{log.content?.index} Narrator</p>
										)}
									</div>

									{showReplayScreen && (
										<div className={styles.actions}>
											{replayIndex === -1 && log.content.index && (
												<Image
													src="/images/play.png"
													alt="Play"
													width={20}
													height={20}
													onClick={() => {
														if (log.content.index)
															setReplayIndex(log.content.index);
													}}
												/>
											)}

											{replayIndex >= 0 && log.content.index && (
												<Image
													src="/images/stop.png"
													alt="Stop"
													width={20}
													height={20}
													onClick={stopReplay}
												/>
											)}
										</div>
									)}
								</div>
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
