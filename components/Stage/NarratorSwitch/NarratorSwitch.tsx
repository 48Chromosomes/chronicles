import React from 'react';
import Image from 'next/image';

import styles from './NarratorSwitch.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function NarratorSwitch() {
	const { selectedNarrator, toggleNarrator } = useAppStore();

	return (
		<div className={styles.narratorSwitchContainer}>
			<div onClick={() => toggleNarrator()}>
				<span>Narrator: </span>
				{selectedNarrator}
			</div>
		</div>
	);
}
