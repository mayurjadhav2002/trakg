"use client"

import { useEffect, useRef, useState } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export function ReturningUserCard({ returningUsers }) {
	const cardRef = useRef(null)
	const [isInView, setIsInView] = useState(false)
	const [displayValue, setDisplayValue] = useState(0)


	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setIsInView(true)
			},
			{ threshold: 0.5 }
		)
		if (cardRef.current) observer.observe(cardRef.current)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		if (!isInView) return

		let start = 0
		const duration = 1500
		const startTime = performance.now()

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)
			const eased = start + ((returningUsers?.returningUserPercentage || 0) - start) * progress

			setDisplayValue(parseFloat(eased.toFixed(1)))

			if (progress < 1) {
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	}, [isInView, returningUsers])

	return (
		<Card ref={cardRef} className="text-center">
			<CardHeader>
				<CardTitle>Returning User %</CardTitle>
				<CardDescription>Based on user activity and sessions</CardDescription>
			</CardHeader>
			<CardContent className="text-[60px] text-center flex justify-center align-middle font-bold text-primary py-4">
				<div>
					{displayValue}%
					<br />
					<p className="text-2xl text-gray-800">{returningUsers?.returningUserCount || 0}</p>
				</div>

			</CardContent>
		</Card>
	)
}
