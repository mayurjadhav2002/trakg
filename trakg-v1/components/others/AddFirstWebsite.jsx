import React from "react";
import "@/style/firstWebsite.min.css";
import Link from "next/link";
function AddFirstWebsite() {
	return (
		<Link
			href={"/dashboard/website/new"}
			className='relative inline-block w-full py-3 modgp'
		>
			<div className='relative'>
				<button
					className='inline-flex items-center justify-center bg-primary text-sm text-white dark:text-gray-200 
					dark:bg-black dark:shadow-gray-800 dark:shadow-md
					font-medium rounded-lg enabled:hover:bg-primary-dark enabled:hover:shadow-md enabled:active:bg-primary-dark enabled:focus:bg-primary-dark focus:outline-none px-4 py-2 w-full py-2.5 relative disabled:opacity-50 transition-all'
					type='button'
				>
					<div className='w-full flex items-center font-semibold justify-center'>
						Add New Website
					</div>
				</button>
			</div>
			{/* <div className='absolute inset-0 pointer-events-none'>
				<div
					id='style-AQliM'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-AQliM'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='16'
						width='16'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-WCb99'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-WCb99'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='19'
						width='19'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-dBNZV'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-dBNZV'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='17'
						width='17'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-tiisO'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-tiisO'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='16'
						width='16'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-re9B7'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-re9B7'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='19'
						width='19'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-BKG4G'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-BKG4G'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='15'
						width='15'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-NaoVe'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-NaoVe'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='16'
						width='16'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-pwIlv'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-pwIlv'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='19'
						width='19'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-QmcAd'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-QmcAd'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='15'
						width='15'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
				<div
					id='style-VG2eL'
					className='pointer-events-none absolute z-10 animate-magic-sparkle style-VG2eL'
				>
					<svg
						style={{
							filter: "drop-shadow(rgb(96, 165, 250) 0px 0px 2px)",
						}}
						fill='none'
						viewBox='0 0 68 68'
						height='19'
						width='19'
						className='animate-spin-slow'
					>
						<path
							fill='white'
							d='M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'
						></path>
					</svg>
				</div>
			</div> */}
		</Link>
	);
}

export default AddFirstWebsite;
