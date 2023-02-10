'use client';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import Link from 'next/link';
import {
	useEffect,
	useRef,
	useState,
	MouseEvent,
	MouseEventHandler,
} from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	InteractionItem,
} from 'chart.js';
import {
	Bar,
	getDatasetAtEvent,
	getElementAtEvent,
	getElementsAtEvent,
} from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [city, setCity] = useState('');
	const [startDate, setStartDate] = useState('');
	const [labels, setLabels] = useState([
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
	]);
	const [sampleData, setSampleData] = useState([]);
	const [sampleLinks, setSampleLinks] = useState([]);
	const [sampleEvents, setSampleEvents] = useState([]);
	const [options, setOptions] = useState({
		responsive: true,
		plugins: {
			tooltip: {
				enabled: true,
				callbacks: {
					label: function (tooltipItem: { dataIndex: number }, data: any) {
						return '$';
					} as (tooltipItem: { dataIndex: number }, data: any) => string,
				},
			},
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'NBA Games in ' + city + ' on or after ' + startDate,
			},
		},
	});

	// const options = ;

	const dataOne = {
		labels,
		datasets: [
			{
				label: 'Lowest ',
				data: sampleData,
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				barThickness: 80,
				links: sampleLinks,
			},
		],
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();

		const response = await fetch(
			`https://api.seatgeek.com/2/events?taxonomies.name=nba&venue.city=${city}&datetime_utc.gt=${startDate}&client_id=${process.env.CLIENT_ID}`
		);
		const data = await response.json();
		const events = data.events;
		setOptions({
			responsive: true,
			plugins: {
				tooltip: {
					enabled: true,
					callbacks: {
						label: function (tooltipItem: { dataIndex: number }, data: any) {
							if (tooltipItem.dataIndex !== undefined) {
								return (
									events[tooltipItem.dataIndex].short_title +
									' $' +
									events[tooltipItem.dataIndex].stats.lowest_price
								);
							}
							return '';
						} as (tooltipItem: { dataIndex: number }, data: any) => string,
					},
				},
				legend: {
					position: 'top' as const,
				},
				title: {
					display: true,
					text: 'NBA Games in ' + city + ' on or after ' + startDate,
				},
			},
		});

		const dates = data.events.map((event: { datetime_local: any }) =>
			new Date(event.datetime_local).toLocaleDateString()
		);

		setLabels(dates);

		const lowest_prices = data.events.map(
			(event: { stats: { lowest_price: any } }) => event.stats.lowest_price
		);

		setSampleData(lowest_prices);

		const linksForGame = data.events.map((event: { url: any }) => event.url);

		setSampleLinks(linksForGame);
	};

	const chartRef = useRef<ChartJS>(null);

	const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
		if (chartRef.current) {
			const datasetIndexNum = getElementAtEvent(chartRef.current, event)[0]
				.datasetIndex;
			const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;
			window.open(dataOne.datasets[datasetIndexNum].links[dataPoint]), '_blank';
		}
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

			<Bar options={options} data={dataOne} onClick={onClick} ref={chartRef} />
		</>
	);
}
// ! ADD CHART
// ! ADD Links

// ! ADD Titles
// ! ADD Highest Prices
// ! ADD OTHER SPORTS
// ! ADD OTHER CHARTS
