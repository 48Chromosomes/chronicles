import React, { useRef, useState, useEffect } from 'react';
import cx from 'classnames';

import styles from './Screen.module.scss';

import Narrator from '@/components/Narrator/Narrator';
import Character from '@/components/Character/Character';
import Dice from '@/components/Dice/Dice';
import Waiting from '@/components/Waiting/Waiting';
import Countdown from '@/components/Countdown/Countdown';
import Spinner from '@/components/Spinner/Spinner';
import Standby from '@/components/Standby/Standby';

import {
	STAGE_WIDTH_DESKTOP,
	STAGE_HEIGHT_DESKTOP,
	STAGE_WIDTH_MOBILE,
	STAGE_HEIGHT_MOBILE,
} from '@/consts';

import { useAppStore } from '@/stores/AppStore';

export default function Screen() {
	const { background, character, mobile } = useAppStore();
	const [previousBackground, setPreviousBackground] = useState(background);
	const [fadeOut, setFadeOut] = useState<boolean>(false);
	const [ratio, setRatio] = useState<{ width: number; height: number }>({
		width: STAGE_WIDTH_DESKTOP,
		height: STAGE_HEIGHT_DESKTOP,
	});
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

	useEffect(() => {
		mobile
			? setRatio({ width: STAGE_WIDTH_MOBILE, height: STAGE_HEIGHT_MOBILE })
			: setRatio({ width: STAGE_WIDTH_DESKTOP, height: STAGE_HEIGHT_DESKTOP });
	}, [mobile]);

	return (
		<div
			className={styles.screenConatiner}
			style={{ width: ratio.width, height: ratio.height }}
			ref={stageRef}
		>
			{character && <Character />}
			<Narrator />
			<Waiting />
			<Dice />
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
	);
}
