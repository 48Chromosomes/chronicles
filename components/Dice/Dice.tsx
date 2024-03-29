import React, { useEffect, useState, useRef } from 'react';
import DiceBox from '@3d-dice/dice-box-threejs';
import cx from 'classnames';

import styles from './Dice.module.scss';

import { weightedRandom } from '@/utilities';

import { useAppStore } from '@/stores/AppStore';

function DiceComponent() {
	const {
		roll,
		rollDice,
		setNarratorList,
		sendStoryPrompt,
		setChatLogs,
		forceRoll,
		forceRollDice,
	} = useAppStore();
	const [visible, setVisible] = useState<boolean>(false);
	const [box, setBox] = useState<any>(null);
	const appDivRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (roll || forceRoll > 0) {
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
						onRollComplete: (results: any) =>
							console.log(`Rolled ${results.total}`),
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
					const randomNumber = forceRoll > 0 ? forceRoll : weightedRandom();
					const prompt = `I rolled ${randomNumber}`;

					box.roll(`1d20@${randomNumber}`).then(() => {
						setNarratorList(`You rolled ${randomNumber}`);

						if (forceRoll === 0) {
							setChatLogs({ role: 'user', content: { story: prompt } });
							sendStoryPrompt({ prompt });
						} else {
							forceRollDice(0);
						}
					});
				}

				rollDice(false);
				setTimeout(() => setVisible(false), 6000);
			})();
		}
	}, [roll, forceRoll]);

	return (
		<div
			className={cx(styles.diceContainer, { [styles.visible]: visible })}
			id="app"
			ref={appDivRef}
		></div>
	);
}

export default DiceComponent;
