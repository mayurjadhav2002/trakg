'use client';

import { Suspense, useState } from 'react';
import { pricingPlans, subscriptionLink } from '@/stores/constants';
import { Button } from '@/components/ui/button';
import { Info, Check, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import SuspenseLoader from '@/components/loading/SuspenseLoader';
import GetAddressInfo from './GetAddressInfo';




const formatFeature = (key, label, value, topic) => {
	const displayValue = typeof value === 'boolean' || typeof value === 'Number'
		? (value || value === 0 ? '✔️' : '❌')
		: value;

	return {
		key,
		label,
		value: displayValue,
		info: topic[key],
	};
};

export default function PlanTable() {
	const searchParams = useSearchParams();
	const path = searchParams.get('path');
	const newUser = searchParams.get('new_user');
	const [isYearly, setIsYearly] = useState(false);
	const { user } = useUser();
	const [getMoreDetails, setGetMoreDetails] = useState(false)
	const [selectedPlan, setSelectedPlan] = useState(null);

	const getPlanLink = async (plan) => {
		try {
			if (!user?.addressInfo?.address || !user?.addressInfo?.country || !user?.addressInfo?.state || !user?.addressInfo?.city || !user?.addressInfo?.zipCode) {
				setSelectedPlan(plan);
				setGetMoreDetails(true);
				return;
			}
			const metadata = `metadata_customer_id=${user.id}&metadata_plan=${plan}&metadata_useremail=${user.email}`;
			const FetchPlan = await fetch('/api/subscriptions/payment_link', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: user.id,
					PurchasePlan: plan,
					metadata
				}),
			})

			const data = await FetchPlan.json();
			if (data?.success && data?.data?.payment_link) {
				toast.success('Initializing payment. Redirecting to payment page in 5s...', {
					richColors: true,
				});

				setTimeout(() => {
					window.location.href = data.data.payment_link;
				}, 5000);
			} else {
				console.error('Error generating payment link:', data);
				toast.error('Could not generate a payment link. Please try again or Contact Support', {
					richColors: true,
				});
			}
		} catch (error) {
			console.error('Error fetching payment link:', error);
			toast.error('An error occurred while generating the payment link. Please try again.', {
				richColors: true,
			});
		}
	}
	return (

		<section className="bg-white dark:bg-gray-900">
			<div className="py-10 px-4 mx-auto max-w-screen-xl lg:px-6">
				{getMoreDetails && (
					<GetAddressInfo
						setModelActive={setGetMoreDetails}
						plan={selectedPlan}
						getPlanLink={getPlanLink}
					/>
				)}
				<Header setIsYearly={setIsYearly} isYearly={isYearly} path={path} newUser={newUser} />
				<PricingGrid isYearly={isYearly} getPlanLink={getPlanLink} />
			</div>
		</section>
	);
}

function Header({ isYearly, setIsYearly, path, newUser }) {
	return (
		<div className="text-center mb-12">
			{path === 'oauth_no_subscription' && (
				<h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
					You are not subscribed to any plan
				</h2>
			)}
			<h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
				Designed for business teams like yours
			</h2>
			<p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xl mx-auto">
				All plans come with a 7-day free trial. No credit card required.
			</p>

			<div className="flex justify-center items-center space-x-4">
				<span className={!isYearly ? 'font-semibold' : 'text-gray-400'}>Monthly</span>
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						className="sr-only peer"
						checked={isYearly}
						onChange={() => setIsYearly((prev) => !prev)}
					/>
					<div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:bg-white after:rounded-full after:h-5 after:w-5 after:top-[2px] after:left-[2px] after:transition-all peer-checked:after:translate-x-full" />
				</label>
				<span className={isYearly ? 'font-semibold' : 'text-gray-400'}>Yearly</span>
			</div>
		</div>
	);
}



function PricingGrid({ isYearly, getPlanLink }) {
	return (
		<div className="grid lg:grid-cols-3 gap-8">
			{pricingPlans.plans.map((plan) => {
				const featureItems = [
					{
						category: 'Features',
						items: [
							formatFeature('websites', 'Websites', plan.websites, plan.featureInfo),
							formatFeature('customDomains', 'Custom Domains', plan.customDomains, plan.featureInfo),
							formatFeature('externalFormTracking', 'External Form Tracking', plan.externalFormTracking, plan.featureInfo),
							formatFeature('unlimitedForms', 'Unlimited Forms', plan.features.unlimitedForms, plan.featureInfo),
							formatFeature('unlimitedLeads', 'Unlimited Leads', plan.features.unlimitedLeads, plan.featureInfo),
							formatFeature('automations', 'Automations', plan.features.automations, plan.featureInfo),
							formatFeature('aiFeatures', 'AI Features', plan.features.aiFeatures, plan.featureInfo),
							formatFeature('advancedAnalytics', 'Advanced Analytics', plan.features.advancedAnalytics, plan.featureInfo),
						],
					},
					{
						category: 'Security',
						items: [
							formatFeature('gdprCompliance', 'GDPR Compliance', plan.security.gdprCompliance, plan.featureInfo),
							formatFeature('dataEncryption', 'Data Encryption', plan.security.dataEncryption, plan.featureInfo),
							formatFeature('auditLogs', 'Audit Logs', plan.security.auditLogs, plan.featureInfo),
							formatFeature('accessControl', 'Access Control', plan.security.accessControl, plan.featureInfo),
						],
					},
					{
						category: 'Support',
						items: [
							formatFeature('email', 'Email Support', plan.support.email, plan.featureInfo),
							formatFeature('chat', 'Chat Support', plan.support.chat, plan.featureInfo),
							formatFeature('priority', 'Priority Support', plan.support.priority, plan.featureInfo),
							formatFeature('technical', 'Technical Support', plan.support.technical, plan.featureInfo),
						],
					},
				];

				return (
					<div
						key={plan.name}
						className="flex flex-col p-6 text-center bg-white rounded-lg border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700"
					>
						<h3 className="text-2xl font-semibold">{plan.name}</h3>
						<p className="text-gray-500 dark:text-gray-400 mt-1 mb-5 text-sm">Includes all the essentials</p>

						<div className="flex items-baseline justify-center space-x-2">
							<span className="text-4xl font-extrabold">${isYearly ? plan.annualPrice : plan.monthlyPrice}</span>
							<span className="text-gray-500 dark:text-gray-400">/month</span>
						</div>

						<Button className="bg-black dark:bg-white dark:text-black rounded-lg text-white mt-6"
							onClick={() => getPlanLink(isYearly ? plan.annualName : plan.monthlyName)}
						>Start Free Trial</Button>

						<ul className="mt-4 space-y-4 text-left">
							{featureItems.map(({ category, items }) => (
								<div key={category}>
									<h4 className="font-serif text-sm text-gray-600 dark:text-gray-500 mt-4 mb-2">{category}</h4>
									{items.map(({ key, label, value, info }) => (
										<li key={key} className="flex items-start mb-2 justify-between">
											<div className="flex items-center space-x-2 justify-between w-full">
												<span className="flex items-center align-middle gap-2 text-sm font-medium text-gray-900 dark:text-white">
													{(value === '✔️' || typeof value === "number") ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
													{label}{(value !== "✔️" && value !== '❌') && <>: <strong>{value}</strong></>}
												</span>
												<Popover>
													<PopoverTrigger asChild>
														<Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
													</PopoverTrigger>
													<PopoverContent className="max-w-xs text-sm">
														{info}
													</PopoverContent>
												</Popover>
											</div>
										</li>
									))}
								</div>
							))}
						</ul>
					</div>
				);
			})}
		</div>
	);
}
