import { useRef, useState } from 'react';
import Image from 'next/image';

import styles from './CharacterImage.module.scss';

import { useAppStore } from '@/stores/AppStore';

export default function CharacterImage() {
	const { character, characterImage, setCharacterImage } = useAppStore();
	const textInputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [query, setQuery] = useState<string>('');

	const onSubmit = async (event?: React.SyntheticEvent | undefined) => {
		event?.preventDefault();
		setCharacterImage(query);
		setQuery('');
	};

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setQuery(event.target.value);

	return (
		<div className={styles.characterImageContainer}>
			<div className={styles.characterSheet}>
				<h2>{character.name}</h2>

				<p>
					Alignment <span>{character.alignment}</span>
				</p>
				<p>
					Class <span>{character.class}</span>
				</p>
				<p>
					Background <span>{character.background}</span>
				</p>
				<p>
					Race <span>{character.race}</span>
				</p>
				<p>
					Sex <span>{character.sex}</span>
				</p>

				<div className={styles.stats}>
					<p>
						Charisma <span>{character.stats.charisma}</span>
					</p>
					<p>
						Constitution <span>{character.stats.constitution}</span>
					</p>
					<p>
						Dexterity <span>{character.stats.dexterity}</span>
					</p>
					<p>
						Intelligence <span>{character.stats.intelligence}</span>
					</p>
					<p>
						Strength <span>{character.stats.strength}</span>
					</p>
					<p>
						Wisdom <span>{character.stats.wisdom}</span>
					</p>
				</div>

				<div className={styles.listContainer}>
					<div className={styles.list}>
						<h3>Equipment</h3>

						<ul>
							{character.equipment.map((piece: string, index: number) => (
								<li key={index}>
									<p>{piece}</p>
								</li>
							))}
						</ul>
					</div>

					<div className={styles.list}>
						<h3>Proficiencies</h3>

						<ul>
							{character.proficiencies.map(
								(proficiency: string, index: number) => (
									<li key={index}>
										<p>{proficiency}</p>
									</li>
								),
							)}
						</ul>
					</div>
				</div>
			</div>

			<img
				className={styles.characterImage}
				src={characterImage}
				alt={character.name}
			/>

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

					<button className={styles.button} type="submit">
						<Image src="/images/send.svg" alt="Send" width={20} height={20} />
					</button>
				</form>
			</div>

			<img className={styles.arrow} src="/images/arrow.png" alt="Pull down" />
		</div>
	);
}
