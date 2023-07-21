import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Stage = dynamic(() => import('@/components/Stage/Stage'), { ssr: false });
const Console = dynamic(() => import('@/components/Console/Console'), {
	ssr: false,
});
const Actions = dynamic(() => import('@/components/Actions/Actions'), {
	ssr: false,
});
const Music = dynamic(() => import('@/components/Music/Music'), {
	ssr: false,
});

export default function Home() {
	return (
		<>
			<Head>
				<title>Monkey Labs - Stage</title>
			</Head>

			<main>
				<Music />
				<Stage />
				<Actions />
				<Console />
			</main>
		</>
	);
}
