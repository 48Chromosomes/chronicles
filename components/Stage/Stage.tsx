import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';

import styles from './Stage.module.scss';

import Replay from '@/components/Replay/Replay';
import Screen from '@/components/Stage/Screen/Screen';
import NextAction from '@/components/Stage/NextAction/NextAction';
import RatioSwitch from '@/components/Stage/RatioSwitch/RatioSwitch';
import ReplaySwitch from '@/components/Stage/ReplaySwitch/ReplaySwitch';
import NarratorSwitch from '@/components/Stage/NarratorSwitch/NarratorSwitch';

import { STAGE_WIDTH_DESKTOP } from '@/consts';

import { useAppStore } from '@/stores/AppStore';

export default function Stage() {
	const { showReplayScreen } = useAppStore();

	return (
		<div
			className={styles.stageContainer}
			style={{ width: STAGE_WIDTH_DESKTOP }}
		>
			<RatioSwitch />
			<ReplaySwitch />

			{showReplayScreen ? <Replay /> : <Screen />}

			<NextAction />
			<NarratorSwitch />
		</div>
	);
}
