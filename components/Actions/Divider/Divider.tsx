import React from 'react';

import styles from './Divider.module.scss';

type DividerProps = {
	label: string;
};

export default function Divider({ label }: DividerProps) {
	return <div className={styles.dividerContainer}>{label}</div>;
}
