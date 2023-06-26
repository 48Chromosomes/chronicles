import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import styles from './Countdown.module.scss';

import { useAppStore } from '@/stores/AppStore';

function Countdown() {
	const { countdown, setCountdown, updateLiveChats } = useAppStore();
	const [countdownEnded, setCountdownEnded] = useState(false);
	const [count, setCount] = useState(20);

	useEffect(() => {
		if (count > 0 && countdown) {
			const id = setInterval(() => {
				setCount((currentCount) => currentCount - 1);
			}, 1000);

			return () => clearInterval(id);
		} else if (countdown && !countdownEnded) {
			updateLiveChats();
			setCountdown(false);
			setCountdownEnded(true);
			setTimeout(() => setCount(20), 2000);
		}
	}, [count, countdown, countdownEnded]);

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
