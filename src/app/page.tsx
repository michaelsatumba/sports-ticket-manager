'use client';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [city, setCity] = useState('');
	const [startDate, setStartDate] = useState('');
	const CLIENT_ID = process.env.CLIENT_ID;

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// console.log(city, startDate);
		const response = await fetch(
			`https://api.seatgeek.com/2/events?taxonomies.name=nba&venue.city=${city}&datetime_utc.gt=${startDate}&client_id=${CLIENT_ID}`
		);
		const data = await response.json();
	};

	return (
		<>
			<div className="flex justify-between items-center p-6 bg-black text-white">
				<Link href="/">
					<img src="/images/NBA_logo.webp" alt="" className="h-12" />
				</Link>

				<p className="text-2xl font-bold">Sports Ticket Manager</p>

				<img src="/images/0x0.webp" alt="" className="h-12" />
			</div>
			<form
				id="searchForm"
				className="flex flex-col md:flex-row justify-between items-center my-6 mx-auto max-w-lg"
			>
				<label htmlFor="city" className="font-bold text-lg mr-4">
					City:
				</label>
				<input
					type="text"
					id="city"
					className="p-2 border border-gray-400 rounded-lg shadow-md w-full md:w-2/3"
					value={city}
					onChange={(event) => setCity(event.target.value)}
				/>

				<label htmlFor="startDate" className="font-bold text-lg mr-4">
					From:
				</label>
				<input
					type="date"
					id="startDate"
					className="p-2 border border-gray-400 rounded-lg shadow-md w-full md:w-2/3"
					value={startDate}
					onChange={(event) => setStartDate(event.target.value)}
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					onClick={handleSubmit}
				>
					Get Events
				</button>
			</form>

			{/* <div className="wrapper h-64 mx-auto">
				<canvas id="myChart" className="text-5xl"></canvas>
			</div> */}
		</>
	);
}
// ! ADD CHART
// ! ADD OTHER SPORTS
// ! ADD OTHER CHARTS
