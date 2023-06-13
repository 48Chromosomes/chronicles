import React from 'react';

import styles from './Button.module.scss';

interface ButtonProps {
	disabled?: boolean;
	label: string;
	onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ disabled, label, onClick }) => {
	return (
		<button className={styles.button} onClick={onClick} disabled={disabled}>
			{label}
		</button>
	);
};

export default Button;
