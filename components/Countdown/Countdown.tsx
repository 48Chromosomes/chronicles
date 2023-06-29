import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import styles from './Countdown.module.scss';

import { useAppStore } from '@/stores/AppStore';

function Countdown() {
	const { countdown, setCountdown, updateLiveChats } = useAppStore();
	const [countdownEnded, setCountdownEnded] = useState(true);
	const [count, setCount] = useState(40);

	useEffect(() => {
		if (countdown) {
			setCountdownEnded(false);

			if (count > 0) {
				const id = setInterval(() => {
					setCount((currentCount) => currentCount - 1);
				}, 1000);

				return () => clearInterval(id);
			} else {
				updateLiveChats();
				setCountdown(false);
				setCountdownEnded(true);
			}
		}
	}, [count, countdown]);

	useEffect(() => {
		if (countdownEnded) {
			setTimeout(() => setCount(40), 2000);
		}
	}, [countdownEnded]);

	return (
		<>
			<div
				className={cx(styles.countdownContainer, {
					[styles.faded]: !countdown,
				})}
			>
				<div className={styles.counter}>{count}</div>

				{Array.from({ length: 200 }, (_, index) => (
					<div key={index} className={styles.tri}></div>
				))}
			</div>
		</>
	);
}

export default Countdown;
