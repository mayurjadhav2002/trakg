"use client";

import {Label} from "@/components/ui/label";
import Image from "next/image";

export default function Loader() {
	return (
		<div className='h-screen w-screen bg-black flex flex-col items-center justify-center text-center'>
			<Image
				src='/assets/trakg.gif'
				width={200}
				height={200}
				alt='Trakg Logo Animation'
				className='animate-pulse'
			/>
			<Label className='text-white text-lg mt-4'>
				Welcome to <span className='font-bold'>Trakg</span> <br />
				<span className='text-green-400'>
					Preparing your experience...
				</span>
			</Label>
		</div>
	);
}
