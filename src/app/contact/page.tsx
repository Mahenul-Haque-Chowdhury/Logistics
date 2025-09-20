"use client";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const reasonOptions = [
	{ value: 'dispatch', label: 'Interested in Dispatch Solutions' },
	{ value: 'partner', label: 'Want to Partner Up' },
	{ value: 'price', label: 'Price Inquiry' },
	{ value: 'other', label: 'Something Else' }
];

const priceTierOptions = [
	{ value: 'single', label: 'Single Vehicle' },
	{ value: 'multi', label: '2-5 Vehicles' },
	{ value: 'fleet', label: 'Fleet (6+ Vehicles)' },
	{ value: 'expedited', label: 'Expedited / Hotshot' }
];

const schema = z.object({
	firstName: z.string().min(2, 'Too short'),
	lastName: z.string().min(2, 'Too short'),
	email: z.string().email('Invalid email'),
	phone: z.string().min(7, 'Invalid number').optional().or(z.literal('')),
	reason: z.enum(['dispatch', 'partner', 'price', 'other']),
	pickupZip: z.string().regex(/^\d{5}$/, '5-digit ZIP').optional().or(z.literal('')),
	dropoffZip: z.string().regex(/^\d{5}$/, '5-digit ZIP').optional().or(z.literal('')),
	vehicleDetails: z.string().max(140, 'Keep under 140 chars').optional().or(z.literal('')),
	priceTier: z.string().optional(),
	message: z.string().max(500, 'Max 500 chars').optional().or(z.literal('')),
	consent: z.boolean().refine(v => v, 'Consent required'),
}).refine(data => {
	if (data.reason === 'price') {
		return !!data.pickupZip && !!data.dropoffZip && !!data.priceTier;
	}
	return true;
}, { message: 'Pickup, Dropoff & Price Tier required for price inquiries', path: ['priceTier'] });

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
	const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { reason: 'dispatch', consent: false } });
	const reason = watch('reason');
	const [submitted, setSubmitted] = useState(false);

	async function onSubmit(values: FormValues) {
		console.log('Contact submission', values); // placeholder
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
		reset({ reason: values.reason, consent: false });
	}

	return (
		<main className="relative min-h-[calc(100vh-4rem)] flex items-start md:items-center justify-center py-16 md:py-20 overflow-hidden">
			{/* Background now theme-aware */}
			<div className="absolute inset-0 -z-10 bg-neutral-50 dark:bg-neutral-950 transition-colors">
				<div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-20 dark:opacity-30 mix-blend-overlay" />
				<div className="absolute inset-0 bg-gradient-to-b from-neutral-200/60 via-neutral-100/70 to-neutral-50 dark:from-neutral-900/60 dark:via-neutral-950/80 dark:to-neutral-950 transition-colors" />
			</div>

			<motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full max-w-5xl mx-auto px-6">
				<div className="backdrop-blur-sm bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-lg p-8 md:p-10 text-neutral-800 dark:text-neutral-100 transition-colors">
					<div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
						<div className="md:w-64 space-y-4">
							<h1 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight">Get In Touch</h1>
							<p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">Fast response. Real people. Tell us what you need and our team will route it to the right specialist.</p>
							<ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 pt-2">
								<li><span className="text-neutral-700 dark:text-neutral-200">Response Time:</span> Under 1 business hour</li>
								<li><span className="text-neutral-700 dark:text-neutral-200">Coverage:</span> Lower 48 States</li>
								<li><span className="text-neutral-700 dark:text-neutral-200">Support:</span> 24/7 Dispatch Monitoring</li>
							</ul>
						</div>
						<form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-8">
							<div className="grid md:grid-cols-3 gap-5">
								<Field label="First Name" error={errors.firstName?.message}>
									<input {...register('firstName')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="First Name" />
								</Field>
								<Field label="Last Name" error={errors.lastName?.message}>
									<input {...register('lastName')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="Last Name" />
								</Field>
								<Field label="Email" error={errors.email?.message}>
									<input type="email" {...register('email')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="email@company.com" />
								</Field>
							</div>
							<div className="grid md:grid-cols-3 gap-5">
								<Field label="Phone" error={errors.phone?.message}>
									<input {...register('phone')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="(555) 555-5555" />
								</Field>
								<Field label="Reason" error={errors.reason?.message}>
									<select {...register('reason')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
										{reasonOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
									</select>
								</Field>
								{reason === 'price' && (
									<Field label="Price Tier" error={errors.priceTier?.message}>
										<select {...register('priceTier')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
											<option value="">Select...</option>
											{priceTierOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
										</select>
									</Field>
								)}
							</div>

							{reason === 'price' && (
								<div className="grid md:grid-cols-3 gap-5">
									<Field label="Pickup ZIP" error={errors.pickupZip?.message}>
										<input {...register('pickupZip')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="90210" />
									</Field>
									<Field label="Dropoff ZIP" error={errors.dropoffZip?.message}>
										<input {...register('dropoffZip')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="10001" />
									</Field>
									<Field label="Vehicle Details" error={errors.vehicleDetails?.message}>
										<input {...register('vehicleDetails')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="Year / Make / Model" />
									</Field>
								</div>
							)}

							<div className="grid gap-5 md:grid-cols-3">
								<Field label="Message (Optional)" error={errors.message?.message} className="md:col-span-2">
									<textarea rows={reason === 'price' ? 4 : 5} {...register('message')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-600/40 bg-white/70 dark:bg-neutral-900/40 focus:bg-white dark:focus:bg-neutral-900/60 backdrop-blur px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition resize-none" placeholder="Share context or requirements" />
								</Field>
								<div className="space-y-4 md:pt-1">
									<label className="flex items-start gap-2 text-xs leading-relaxed cursor-pointer select-none">
										<input type="checkbox" {...register('consent')} className="mt-0.5 h-4 w-4 rounded border-neutral-400 bg-white dark:bg-neutral-900/60" />
										<span>I allow this company to use my data.</span>
									</label>
									{errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}
									<p className="text-[10px] leading-snug text-neutral-500 dark:text-neutral-400 pt-1">Disclaimer: By providing my phone number to My Company, I agree and acknowledge that My Company may send text messages to my wireless phone number for any purpose. Message and data rates may apply. Message frequency will vary, and you will be able to Opt-out by replying &quot;STOP&quot;. For more info view our <Link href="/privacy" className="underline decoration-dotted hover:text-brand-600 dark:hover:text-brand-400">Privacy Policy</Link>.</p>
								</div>
							</div>

							<div className="flex items-center gap-4 pt-2">
								<button disabled={isSubmitting} className="btn-primary px-6">{isSubmitting ? 'Sending...' : 'Submit'}</button>
								{submitted && <span className="text-sm text-green-400">Sent!</span>}
							</div>
						</form>
					</div>
				</div>
			</motion.div>
		</main>
	);
}

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string; }) {
	return (
		<div className={className + " space-y-1"}>
			<label className="text-xs uppercase tracking-wide font-medium text-neutral-300">{label}</label>
			{children}
			{error && <p className="text-[10px] font-medium text-red-400">{error}</p>}
		</div>
	);
}

// Shared field class (Tailwind) via global styles could be extracted later
// Using small utility to keep patch focused.
// (Removed unused global interface & inline style utility after inlining classes.)

