"use client";

import Image from "next/image";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center h-screen overflow-hidden bg-[#f6fffe] text-center px-4'>
			<h1 className='text-3xl md:text-4xl -mb-20 font-extrabold text-black'>
				Oops!
			</h1>

			<Image
				src='/assets/svg/404-page.svg' // replace with your actual path
				alt='404 illustration'
				width={400}
				height={400}
				className='h-full w-full'
				priority
			/>

			<Link
				href='/dashboard'
				className='flex  -mt-10 items-center gap-2 text-sm font-medium border-b border-black hover:opacity-80 transition'
			>
				<ArrowLeft className='h-4 w-4 ' />
				Go Home
			</Link>
		</div>
	);
}
