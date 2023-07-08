import React from 'react';
import Image from 'next/image';

import styles from './NextAction.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function NextAction() {
	const { nextAction, setNextAction } = useAppStore();

	const toggleNextAction = () => {
		const action =
			nextAction === 'ROLL_DICE' || nextAction === ''
				? 'COUNTDOWN'
				: 'ROLL_DICE';

		setNextAction(action);
	};

	const clearNextAction = () => setNextAction('');

	return (
		<div className={styles.nextActionContainer}>
			<div onClick={toggleNextAction}>
				<span>Next Action:</span> {nextAction || '-'}
			</div>

			<div className={styles.clear} onClick={clearNextAction}>
				<Image src="/images/no-entry.png" width={18} height={18} alt="Clear" />
			</div>
		</div>
	);
}
