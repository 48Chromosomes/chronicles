import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Stream = dynamic(() => import('@/components/Stream/Stream'), {
	ssr: false,
});

export default function Home() {
	return (
		<>
			<Head>
				<title>Monkey Labs - Live</title>
			</Head>

			<main>
				<Stream />
			</main>
		</>
	);
}
