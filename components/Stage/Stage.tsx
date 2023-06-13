import styles from './Stage.module.scss';

import Narrator from '@/components/Narrator/Narrator';

export default function Stage() {
	return (
		<div className={styles.stageContainer}>
			<div className={styles.stage}>
				<Narrator />
			</div>
		</div>
	);
}
