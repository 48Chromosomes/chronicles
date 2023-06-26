import React, { useState, useEffect, use } from 'react';
import { useAppStore } from '@/stores/AppStore';

export default function Music() {
	const { narrating, playMusic } = useAppStore();
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audioObj = new Audio('audio/background.mp3');
		audioObj.loop = true;
		audioObj.volume = 0.1;
		setAudio(audioObj);
	}, []);

	useEffect(() => {
		if (audio) {
			if (playMusic) {
				audio.play();
			} else {
				audio.pause();
			}
		}
	}, [playMusic]);

	useEffect(() => {
		if (audio) {
			audio.volume = narrating ? 0.1 : 0.2;
		}
	}, [narrating, audio]);

	return null;
}
