import React, { useState, useEffect, useRef, use } from 'react';
import { RecordRTCPromisesHandler } from 'recordrtc';
import { WebRTCAdaptor } from '@/utilities/antmedia';

import styles from './Stream.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function Stream() {
	const { stageDimensions } = useAppStore();
	const [recorder, setRecorder] = useState<RecordRTCPromisesHandler | null>();
	const [stream, setStream] = useState<MediaStream | null>();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const canvasWidth = 1024;
	const canvasHeight = 576;

	useEffect(() => {
		(async () => {
			if (videoRef.current && stream) {
				videoRef.current.srcObject = stream;
				//videoRef.current.muted = true;
				//videoRef.current.volume = 0;
			} else if (!stream) {
				const { mediaDevices } = navigator;

				const stream: MediaStream = await (mediaDevices as any).getDisplayMedia(
					{
						video: true,
						audio: true,
					},
				);

				const recorder: RecordRTCPromisesHandler = new RecordRTCPromisesHandler(
					stream,
					{
						type: 'video',
						disableLogs: true,
					},
				);

				await recorder.startRecording();
				setRecorder(recorder);
				setStream(stream);
			}
		})();
	}, [stream]);

	useEffect(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		let animationFrameId: number;

		const render = () => {
			if (video && canvas) {
				const ctx = canvas.getContext('2d');

				if (ctx) {
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = 'high';
				}

				if (ctx) {
					ctx.drawImage(
						video,
						stageDimensions.offsetX || 0,
						(stageDimensions.offsetY || 0) - 0 || 0,
						stageDimensions.width || canvasWidth,
						stageDimensions.height || canvasHeight,
						0,
						0,
						canvasWidth,
						canvasHeight,
					);
				}
			}

			animationFrameId = requestAnimationFrame(render);
		};

		render();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [stageDimensions]);

	return (
		<div className={styles.streamContainer}>
			<div className={styles.videoContainer}>
				<video
					ref={videoRef}
					autoPlay
					playsInline
					style={{ display: 'none' }}
				></video>

				<canvas
					ref={canvasRef}
					width={canvasWidth}
					height={canvasHeight}
				></canvas>
			</div>
		</div>
	);
}
