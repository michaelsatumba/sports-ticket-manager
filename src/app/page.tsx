'use client';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import Link from 'next/link';
import { useRef, useState, MouseEvent } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement,
} from 'chart.js';
import { Bar, getElementAtEvent, Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [city, setCity] = useState('la');
	const today = new Date().toISOString().substring(0, 10);
	const [startDate, setStartDate] = useState(today);
	const [labels, setLabels] = useState([
		'January',
		'February',
		'March',
		'April',
		'May',
		'July',
	]);
	const [sampleData, setSampleData] = useState([]);
	const [sampleLinks, setSampleLinks] = useState([]);
	const [sampleAverage, setSampleAverage] = useState([]);
	const [sampleHighest, setSampleHighest] = useState([]);
	const [sport, setSport] = useState('nba');

	const [options, setOptions] = useState({
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			tooltip: {
				enabled: true,
				callbacks: {
					label: function (tooltipItem: { dataIndex: any }) {
						return;
					},
				},
				titleFont: {
					size: 20,
				},
				bodyFont: {
					size: 20,
				},
			},
			legend: {
				position: 'top' as const,
				labels: {
					font: {
						size: 20,
					},
				},
			},
			title: {
				display: true,
				text:
					sport +
					' games in ' +
					city +
					' on or after ' +
					new Date(startDate.replace('-', '/')).toLocaleDateString('en-US', {
						month: '2-digit',
						day: '2-digit',
						year: 'numeric',
					}),
				font: {
					size: 20,
				},
			},
		},
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						size: 40,
					},
				},
			},
			y: {
				stacked: true,
				grid: {
					display: true,
				},
				ticks: {
					font: {
						size: 20,
					},
					callback: function (value: any) {
						return '$' + value;
					},
				},
			},
		},
		elements: {
			line: {
				borderColor: 'red',
			},
			point: {
				radius: 10,
			},
		},
	});

	const dataOne = {
		labels,
		datasets: [
			{
				label: 'Lowest Price ',
				data: sampleData,
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				barThickness: 80,
				links: sampleLinks,
			},
			{
				label: 'Average Price ',
				data: sampleAverage,
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				barThickness: 80,
				links: sampleLinks,
			},
			{
				label: 'Highest Price ',
				data: sampleHighest,
				backgroundColor: 'rgba(255, 206, 86, 0.5)',
				barThickness: 80,
				links: sampleLinks,
			},
		],
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();

		const response = await fetch(
			`https://api.seatgeek.com/2/events?taxonomies.name=${sport}&venue.city=${city}&datetime_utc.gt=${startDate}&client_id=${process.env.CLIENT_ID}`
		);
		const data = await response.json();
		const events = data.events;
		console.log(events);
		setOptions({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				tooltip: {
					enabled: true,
					callbacks: {
						label: function (tooltipItem: { dataIndex: any }) {
							return (
								'$' +
								events[tooltipItem.dataIndex].stats.lowest_price +
								' - ' +
								events[tooltipItem.dataIndex].short_title
							);
						},
					},
					titleFont: {
						size: 30,
					},
					bodyFont: {
						size: 20,
					},
				},

				legend: {
					position: 'top' as const,
					labels: {
						font: {
							size: 20,
						},
					},
				},
				title: {
					display: true,
					text:
						sport +
						' games in ' +
						city +
						' on or after ' +
						new Date(startDate.replace('-', '/')).toLocaleDateString('en-US', {
							month: '2-digit',
							day: '2-digit',
							year: 'numeric',
						}),
					font: {
						size: 20,
					},
				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
					ticks: {
						font: {
							size: 20,
						},
					},
				},
				y: {
					stacked: true,
					grid: {
						display: true,
					},
					ticks: {
						font: {
							size: 20,
						},
						callback: function (value: any) {
							return '$' + value;
						},
					},
				},
			},
			elements: {
				line: {
					borderColor: 'white',
				},
				point: {
					radius: 10,
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

		const average_prices = data.events.map(
			(event: { stats: { average_price: any } }) => event.stats.average_price
		);

		setSampleAverage(average_prices);

		const highest_prices = data.events.map(
			(event: { stats: { highest_price: any } }) => event.stats.highest_price
		);

		setSampleHighest(highest_prices);

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
			<div className="flex flex-col h-screen">
				<div className="flex justify-between items-center p-6 bg-black text-white">
					<div className="h-12">
						<Link href="/">
							<Image
								src="/espn_logo_download.webp"
								alt="ESPN"
								width={60}
								height={60}
							/>
						</Link>
					</div>

					<p className="text-2xl font-bold">Sports Ticket Manager</p>

					<div className="h-12 ">
						<Link href="https://seatgeek.com/">
							<Image src="/0x0.webp" alt="SEATGEEK" width={50} height={50} />
						</Link>
					</div>
				</div>
				<form
					id="searchForm" // maybe get rid of this
					className="flex flex-col md:flex-row justify-between items-center bg-black text-white"
				>
					<div className="flex flex-col md:flex-row items-center">
						<label htmlFor="city" className="font-bold text-lg mr-4">
							Sport:
						</label>
						<input
							type="text"
							id="city"
							className="p-2 border border-gray-400 rounded-lg shadow-md w-full md:w-2/3 text-black"
							value={sport}
							onChange={(event) => setSport(event.target.value)}
						/>
					</div>
					<div className="flex flex-col md:flex-row items-center">
						<label htmlFor="city" className="font-bold text-lg mr-4">
							City:
						</label>
						<input
							type="text"
							id="city"
							className="p-2 border border-gray-400 rounded-lg shadow-md w-full md:w-2/3 text-black"
							value={city}
							onChange={(event) => setCity(event.target.value)}
						/>
					</div>
					<div className="flex flex-col md:flex-row items-center">
						<label htmlFor="startDate" className="font-bold text-lg mr-4">
							From:
						</label>
						<input
							type="date"
							id="startDate"
							className="p-2 border border-gray-400 rounded-lg shadow-md w-full md:w-2/3 text-black"
							value={startDate}
							onChange={(event) => setStartDate(event.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded m-1"
						onClick={handleSubmit}
					>
						Get Events
					</button>
				</form>

				<div className="flex flex-grow">
					<Bar
						className="bg-black "
						options={options}
						data={dataOne}
						onClick={onClick}
						ref={chartRef}
					/>
				</div>
			</div>
			<div className="bg-black h-screen">
				<Line options={options} data={dataOne} />
			</div>
		</>
	);
}
// ? ADD CHART
// ? ADD Links
// ? ADD Titles
// ? ADD Highest Prices
// ? ADD OTHER SPORTS
// ? Make it responsive

// ! Date
// ! ADD OTHER CHARTS
