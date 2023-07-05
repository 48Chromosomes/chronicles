import React from 'react';
import cx from 'classnames';

import styles from './Standby.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function Standby() {
	const { standby } = useAppStore();

	return (
		<div
			className={cx(styles.standbyContainer, { [styles.faded]: !standby })}
		></div>
	);
}
