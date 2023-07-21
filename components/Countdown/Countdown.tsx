import React, { useEffect, useState } from 'react';
import { Caladea } from 'next/font/google';
import cx from 'classnames';

import styles from './Countdown.module.scss';

import { useAppStore } from '@/stores/AppStore';

const caladea = Caladea({ weight: '700', subsets: ['latin'], style: 'italic' });

const countdownTime = 30;

function Countdown() {
	const { countdown, setCountdown, updateLiveChats, setShouldSelectLiveChat } =
		useAppStore();
	const [countdownEnded, setCountdownEnded] = useState(true);
	const [count, setCount] = useState(countdownTime);

	useEffect(() => {
		if (countdown) {
			setCountdownEnded(false);

			if (count > 0) {
				const id = setInterval(() => {
					setCount((currentCount) => currentCount - 1);
				}, 1000);

				return () => clearInterval(id);
			} else {
				setShouldSelectLiveChat(true);
				updateLiveChats();
				setCountdown(false);
				setCountdownEnded(true);
			}
		} else {
			setTimeout(() => setCount(countdownTime), 2000);
		}
	}, [count, countdown]);

	useEffect(() => {
		if (countdownEnded) {
			setTimeout(() => setCount(countdownTime), 2000);
		}
	}, [countdownEnded]);

	return (
		<>
			<div
				className={cx(styles.countdownContainer, {
					[styles.faded]: !countdown,
				})}
			>
				<div className={cx(styles.counter, caladea.className)}>{count}</div>

				{Array.from({ length: 200 }, (_, index) => (
					<div key={index} className={styles.circle}></div>
				))}
			</div>
		</>
	);
}

export default Countdown;
