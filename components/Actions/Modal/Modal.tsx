import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/Actions/Button/Button';

import styles from './Modal.module.scss';

type ModalProps = {
	text: string;
	buttonLabel: string;
	visible: boolean;
	defaultValue?: string;
	shouldCollectValue?: boolean;
	callback?: (value: string) => void;
	onClose?: () => void; // function to call when modal should be closed
};

export default function Modal({
	text,
	buttonLabel,
	visible,
	defaultValue,
	shouldCollectValue = false,
	callback,
	onClose,
}: ModalProps) {
	const textInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState<string>(defaultValue || '');

	useEffect(() => {
		setQuery(defaultValue || '');
	}, [defaultValue]);

	const onSubmit = async (event?: React.SyntheticEvent | undefined) => {
		event?.preventDefault();

		if (callback) callback(query);

		if (onClose) onClose();
	};

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setQuery(event.target.value);

	const cancel = (e: React.MouseEvent) => {
		if (e.target === modalRef.current) {
			if (onClose) onClose();
		}
	};

	return (
		<>
			{visible && (
				<div ref={modalRef} className={styles.modalContainer} onClick={cancel}>
					<div className={styles.modal}>
						<div className={styles.text}>{text}</div>

						{shouldCollectValue && (
							<div className={styles.formContainer}>
								<form
									className={styles.form}
									onSubmit={onSubmit}
									ref={formRef}
									autoComplete="off"
								>
									<input
										ref={textInputRef}
										type="text"
										className={styles.promptText}
										value={query}
										name="text"
										onChange={onChange}
									/>
								</form>
							</div>
						)}

						<Button label={buttonLabel} onClick={onSubmit} />
					</div>
				</div>
			)}
		</>
	);
}
