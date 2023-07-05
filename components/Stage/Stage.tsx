import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';

import styles from './Stage.module.scss';

import Narrator from '@/components/Narrator/Narrator';
import Character from '@/components/Character/Character';
import Dice from '@/components/Dice/Dice';
import Waiting from '@/components/Waiting/Waiting';
import Music from '@/components/Music/Music';
import Countdown from '@/components/Countdown/Countdown';
import Spinner from '@/components/Spinner/Spinner';
import Standby from '@/components/Standby/Standby';

import { useAppStore } from '@/stores/AppStore';

export default function Stage() {
	const { background, character } = useAppStore();
	const [previousBackground, setPreviousBackground] = useState(background);
	const [fadeOut, setFadeOut] = useState<boolean>(false);
	const stageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (previousBackground !== background) {
			setTimeout(() => {
				setFadeOut(true);
			}, 2000);

			setTimeout(() => {
				setPreviousBackground(background);
				setFadeOut(false);
			}, 5000);
		}
	}, [background]);

	return (
		<div className={styles.stageContainer}>
			<div className={styles.stage} ref={stageRef}>
				{character && <Character />}
				<Narrator />
				<Waiting />
				<Dice />
				<Music />
				<Countdown />
				<Spinner />
				<Standby />

				<div
					className={cx(styles.background, { [styles.fade]: fadeOut })}
					style={{ backgroundImage: `url(${previousBackground})`, zIndex: 2 }}
				></div>

				<div
					className={styles.background}
					style={{ backgroundImage: `url(${background})`, zIndex: 1 }}
				></div>
			</div>
		</div>
	);
}
