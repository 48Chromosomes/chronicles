import dynamic from 'next/dynamic';

const Stage = dynamic(() => import('@/components/Stage/Stage'), { ssr: false });
const Console = dynamic(() => import('@/components/Console/Console'), {
	ssr: false,
});
const Actions = dynamic(() => import('@/components/Actions/Actions'), {
	ssr: false,
});

export default function Home() {
	return (
		<main>
			<Stage />
			<Actions />
			<Console />
		</main>
	);
}
