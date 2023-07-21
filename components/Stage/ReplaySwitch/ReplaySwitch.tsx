import React from 'react';
import Image from 'next/image';

import styles from './ReplaySwitch.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function ReplaySwitch() {
	const { replay, setReplay } = useAppStore();

	const toggleReplay = () => setReplay(!replay);

	return (
		<div className={styles.ratioSwitch} onClick={toggleReplay}>
			{replay && (
				<Image
					alt="Toggle replay"
					src="/images/replay.png"
					height={30}
					width={30}
				/>
			)}

			{!replay && (
				<Image
					alt="Toggle replay"
					src="/images/live.png"
					height={30}
					width={30}
				/>
			)}
		</div>
	);
}
