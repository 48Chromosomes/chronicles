import React from 'react';
import Image from 'next/image';

import styles from './RatioSwitch.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function RatioSwitch() {
	const { mobile, setMobile } = useAppStore();

	const toggleMobile = () => setMobile(!mobile);

	return (
		<div className={styles.ratioSwitch} onClick={toggleMobile}>
			<Image alt="Switch view" src="/images/ratio.png" height={20} width={20} />
		</div>
	);
}
