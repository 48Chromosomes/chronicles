import React from 'react';
import Image from 'next/image';

import styles from './ReplaySwitch.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function ReplaySwitch() {
	const { showReplayScreen, setShowReplayScreen } = useAppStore();

	const toggleReplay = () => setShowReplayScreen(!showReplayScreen);

	return (
		<div className={styles.ratioSwitch} onClick={toggleReplay}>
			{showReplayScreen && (
				<Image
					alt="Toggle replay"
					src="/images/replay.png"
					height={20}
					width={20}
				/>
			)}

			{!showReplayScreen && (
				<Image
					alt="Toggle replay"
					src="/images/live.png"
					height={20}
					width={20}
				/>
			)}
		</div>
	);
}
