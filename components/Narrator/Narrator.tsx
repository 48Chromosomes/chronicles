import React, { useEffect, useState } from 'react';
import { Lora } from 'next/font/google';
import cx from 'classnames';

import styles from './Narrator.module.scss';
import { useAppStore } from '@/stores/AppStore';
import { synthesizeSpeech } from '@/utilities/server';

const lora = Lora({ weight: '500', subsets: ['latin'], style: 'normal' });

export default function Narrator() {
	const { narrating, narratorList, setNarratorList, setNarrating } =
		useAppStore();
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
	const [fadeNarration, setFadeNarration] = useState(false);

	useEffect(() => {
		setCurrentSentenceIndex(0);
	}, [narratorList]);

	useEffect(() => {
		(async () => {
			if (narratorList && narratorList.length > 0) {
				if (currentSentenceIndex < narratorList.length) {
					setNarrating(true);
					setFadeNarration(false);

					const blob = await synthesizeSpeech({
						text: narratorList[currentSentenceIndex],
					});

					const url = URL.createObjectURL(blob);

					const audio = new Audio(url);

					audio.onended = () => {
						setFadeNarration(true);

						setTimeout(() => {
							setCurrentSentenceIndex((prevIndex) => prevIndex + 1);
						}, 500);
					};

					audio.play();
				} else {
					setNarratorList('');
					setNarrating(false);
				}
			}
		})();
	}, [narratorList, currentSentenceIndex]);

	return (
		<div
			className={cx(styles.narratorContainer, { [styles.faded]: !narrating })}
		>
			{narratorList && narratorList.length > 0 && (
				<div
					className={`${styles.narration} ${lora.className} ${
						fadeNarration
							? styles['narration--faded']
							: styles['narration--visible']
					}`}
				>
					{narratorList[currentSentenceIndex]}
				</div>
			)}
		</div>
	);
}
