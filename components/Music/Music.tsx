import React, { useState, useEffect, use } from 'react';
import { useAppStore } from '@/stores/AppStore';

export default function Music() {
	const { narrating, playMusic } = useAppStore();
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audioObj = new Audio('audio/background.mp3');
		audioObj.loop = true;
		audioObj.volume = 0.1;

		const handleCanPlayThrough = () => {
			setAudio(audioObj);
		};

		audioObj.addEventListener('canplaythrough', handleCanPlayThrough);

		return () => {
			audioObj.removeEventListener('canplaythrough', handleCanPlayThrough);
		};
	}, []);

	useEffect(() => {
		if (audio && playMusic) {
			audio.play();
		} else if (audio) {
			audio.pause();
		}
	}, [audio, playMusic]);

	useEffect(() => {
		if (audio) {
			audio.volume = narrating ? 0.1 : 0.2;
		}
	}, [narrating, audio]);

	return null;
}
