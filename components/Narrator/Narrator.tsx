import { useEffect, useState } from 'react';
import styles from './Narrator.module.scss';
import { useAppStore } from '@/stores/AppStore';

export default function Narrator() {
	const { narratorList } = useAppStore();
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
	const [fade, setFade] = useState(false);

	useEffect(() => {
		setCurrentSentenceIndex(0);
	}, [narratorList]);

	useEffect(() => {
		if (
			narratorList &&
			narratorList.length > 0 &&
			currentSentenceIndex < narratorList.length
		) {
			setFade(false);
			const utterance = new SpeechSynthesisUtterance(
				narratorList[currentSentenceIndex],
			);
			utterance.onend = () => {
				setFade(true);

				setTimeout(() => {
					setCurrentSentenceIndex((prevIndex) => prevIndex + 1);
				}, 500);
			};

			window.speechSynthesis.speak(utterance);
		}
	}, [narratorList, currentSentenceIndex]);

	return (
		<div className={styles.narratorContainer}>
			{narratorList && narratorList.length > 0 && (
				<div
					className={`${styles.narration} ${
						fade ? styles['narration--faded'] : styles['narration--visible']
					}`}
				>
					{narratorList[currentSentenceIndex]}
				</div>
			)}
		</div>
	);
}
