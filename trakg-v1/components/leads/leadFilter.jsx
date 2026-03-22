import { SearchIcon } from "lucide-react";
import React, { useId, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../ui/select";

function LeadFilter({
	filters,
	selectedCountry,
	setSelectedCountry,
	selectedFormId,
	setSelectedFormId,
	conversionStatus,
	setConversionStatus,
	searchValue, setSearchValue
}) {
	if (!filters) return;

	return (
		<div className=' items-center justify-between gap-4 '>
			{/* <FilterInput
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				onSearch={() => {
					// Optional: hook up search handling
					console.log("Search for", searchValue);
				}}
			/> */}

			<div className='flex flex-wrap gap-4'>
				{/* Country Filter */}
				<Select onValueChange={setSelectedCountry} value={selectedCountry}>
					<SelectTrigger className='w-[160px]'>
						<SelectValue placeholder='Country' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Countries</SelectItem>
						{filters.countries
							.filter((c) => c && c.trim() !== "")
							.map((country, index) => (
								<SelectItem key={country} value={country || index}>
									{country}
								</SelectItem>
							))}
					</SelectContent>
				</Select>

				{/* Form Filter */}
				<Select onValueChange={setSelectedFormId} value={selectedFormId}>
					<SelectTrigger className='w-[160px]'>
						<SelectValue placeholder='Form' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Forms</SelectItem>
						{filters?.forms?.map((form, index) => (
							<SelectItem key={form.formName} value={form.formName || index}>
								{form.pageUrl}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Conversion Status Filter */}
				<Select onValueChange={setConversionStatus} value={conversionStatus}>
					<SelectTrigger className='w-[160px]'>
						<SelectValue placeholder='Conversion' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All</SelectItem>
						<SelectItem value='true'>Completed</SelectItem>
						<SelectItem value='false'>Partial</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

const FilterInput = ({ value, onChange, onSearch }) => {
	const id = useId();

	return (
		<div className='space-y-2 min-w-[300px]'>
			<div className='relative'>
				<Input
					id={id}
					className='peer pe-12 ps-7'
					placeholder='Filter Using City/Country'
					type='text'
					value={value}
					onChange={onChange}
				/>
				<span className='pointer-events-none absolute inset-y-0 ps-2 start-0 flex items-center justify-center text-sm text-muted-foreground peer-disabled:opacity-50'>
					<SearchIcon className='w-4 h-4' />
				</span>
				<Button
					className='h-7 my-auto rounded-lg absolute inset-y-0 end-0 flex items-center justify-center mr-1 text-sm peer-disabled:opacity-50'
					type='button'
					onClick={onSearch}
				>
					Search
				</Button>
			</div>
		</div>
	);
};

export default LeadFilter;
