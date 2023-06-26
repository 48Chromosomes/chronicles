import React from 'react';
import cx from 'classnames';

import styles from './Waiting.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function Waiting() {
	const { waiting } = useAppStore();

	return (
		<div className={cx(styles.waitingContainer, { [styles.faded]: !waiting })}>
			<div className={styles.fogLayer1}>
				<div className={styles.image1}></div>
				<div className={styles.image2}></div>
			</div>

			<div className={styles.fogLayer2}>
				<div className={styles.image1}></div>
				<div className={styles.image2}></div>
			</div>

			<div className={styles.fogLayer3}>
				<div className={styles.image1}></div>
				<div className={styles.image2}></div>
			</div>
		</div>
	);
}
