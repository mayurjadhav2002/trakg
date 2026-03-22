// app/providers.tsx
'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }) {
	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
			person_profiles: 'always',
			defaults: '2025-05-24'
		})
	}, [])

	return (
		<PHProvider client={posthog}>
			{children}
		</PHProvider>
	)
}
