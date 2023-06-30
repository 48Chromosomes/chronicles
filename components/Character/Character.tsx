import React from 'react';
import { Heebo, Comme } from 'next/font/google';
import cx from 'classnames';

import styles from './Character.module.scss';

import { useAppStore } from '@/stores/AppStore';

const heebo = Heebo({ weight: '300', subsets: ['latin'], style: 'normal' });
const comme = Comme({ weight: '500', subsets: ['latin'], style: 'normal' });

export default function Character() {
	const { narrating, waiting, character, characterImage } = useAppStore();

	return (
		<div
			className={cx(styles.characterContainer, {
				[styles.faded]: narrating || waiting,
			})}
		>
			<div className={cx(styles.characterSheet, heebo.className)}>
				<h2 className={comme.className}>{character.name}</h2>

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
		</div>
	);
}
