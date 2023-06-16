import React, { useEffect, useState, useRef } from 'react';
import DiceBox from '@3d-dice/dice-box-threejs';
import cx from 'classnames';

import styles from './Dice.module.scss';

import { useAppStore } from '@/stores/AppStore';

function DiceComponent() {
	const { roll, rollDice, setNarratorList } = useAppStore();
	const [visible, setVisible] = useState<boolean>(false);
	const [box, setBox] = useState<any>(null);
	const appDivRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		console.log('no roll');
		if (roll) {
			console.log('roll');
			const removeExtraCanvas = () => {
				const { current: appDiv } = appDivRef;

				if (appDiv) {
					const canvases = appDiv.getElementsByTagName('canvas');

					while (canvases.length > 0) {
						appDiv.removeChild(canvases[0]);
					}
				}
			};

			(async () => {
				setVisible(true);

				if (!box) {
					removeExtraCanvas();

					const Box = new DiceBox('#app', {
						theme_customColorset: {
							background: '#222222',
							foreground: '#ffffff',
						},
						theme_surface: 'green-felt',
						light_intensity: 0.5,
						gravity_multiplier: 600,
						baseScale: 100,
						strength: 3,
						onRollComplete: (results: any) => {
							rollDice(false);
							console.log(`Dice rolled: `, results);
							setTimeout(() => setVisible(false), 10000);
						},
					});

					await Box.initialize();

					if (Box.renderer && Box.container) {
						Box.renderer.setSize(
							Box.container.clientWidth,
							Box.container.clientHeight,
						);
					}

					setBox(Box);
				} else {
					const randomNumber = Math.floor(Math.random() * 20) + 1;

					box.roll(`1d20@${randomNumber}`).then(() => {
						setNarratorList(`You rolled ${randomNumber}`);
					});
				}
			})();
		}
	}, [roll]);

	return (
		<div
			className={cx(styles.diceContainer, { [styles.visible]: visible })}
			id="app"
			ref={appDivRef}
		></div>
	);
}

export default DiceComponent;
