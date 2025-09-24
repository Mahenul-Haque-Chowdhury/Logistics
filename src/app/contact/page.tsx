"use client";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/sections/PageHeader';
import Image from 'next/image';
import { Mail, Phone, Headset, MessageSquare, MapPin, Clock } from 'lucide-react';

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
		console.log('Contact submission', values);
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
		reset({ reason: values.reason, consent: false });
	}

	return (
		<main className="container mx-auto max-w-6xl px-6 py-16">
			<PageHeader
				eyebrow="Contact"
				title="Get In Touch"
				description={<>Fast response. Real people. Tell us what you need and we’ll route it to the right specialist.</>}
				align="left"
			/>

			{/* Contact methods */}
			<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<ContactCard icon={<Mail className="w-4 h-4" />} title="Email" href="mailto:hello@example.com" label="hello@example.com" />
				<ContactCard icon={<Phone className="w-4 h-4" />} title="Phone" href="tel:+1234567890" label="+1 (234) 567-890" />
				<ContactCard icon={<Headset className="w-4 h-4" />} title="24/7 Dispatch" href="tel:+1234567890" label="Always On Support" />
				<ContactCard icon={<MessageSquare className="w-4 h-4" />} title="Sales" href="mailto:sales@example.com" label="Talk to Sales" />
			</div>

			{/* Form + Info */}
			<div className="mt-10 grid lg:grid-cols-5 gap-6">
				<section className="lg:col-span-3 surface-elevated p-6 md:p-8 rounded-xl">
					<h2 className="font-heading font-semibold tracking-tight text-xl">Send us a message</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
						<div className="grid md:grid-cols-3 gap-5">
							<Field label="First Name" htmlFor="firstName" error={errors.firstName?.message}>
								<input id="firstName" aria-invalid={!!errors.firstName} {...register('firstName')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="First Name" />
							</Field>
							<Field label="Last Name" htmlFor="lastName" error={errors.lastName?.message}>
								<input id="lastName" aria-invalid={!!errors.lastName} {...register('lastName')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="Last Name" />
							</Field>
							<Field label="Email" htmlFor="email" error={errors.email?.message}>
								<input id="email" type="email" aria-invalid={!!errors.email} {...register('email')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="email@company.com" />
							</Field>
						</div>
						<div className="grid md:grid-cols-3 gap-5">
							<Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
								<input id="phone" aria-invalid={!!errors.phone} {...register('phone')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="(555) 555-5555" />
							</Field>
							<Field label="Reason" htmlFor="reason" error={errors.reason?.message}>
								<select id="reason" aria-invalid={!!errors.reason} {...register('reason')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
									{reasonOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
								</select>
							</Field>
							{reason === 'price' && (
								<Field label="Price Tier" htmlFor="priceTier" error={errors.priceTier?.message}>
									<select id="priceTier" aria-invalid={!!errors.priceTier} {...register('priceTier')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-brand-600/40 transition">
										<option value="">Select...</option>
										{priceTierOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
									</select>
								</Field>
							)}
						</div>

						{reason === 'price' && (
							<div className="grid md:grid-cols-3 gap-5">
								<Field label="Pickup ZIP" htmlFor="pickupZip" error={errors.pickupZip?.message}>
									<input id="pickupZip" aria-invalid={!!errors.pickupZip} {...register('pickupZip')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="90210" />
								</Field>
								<Field label="Dropoff ZIP" htmlFor="dropoffZip" error={errors.dropoffZip?.message}>
									<input id="dropoffZip" aria-invalid={!!errors.dropoffZip} {...register('dropoffZip')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="10001" />
								</Field>
								<Field label="Vehicle Details" htmlFor="vehicleDetails" error={errors.vehicleDetails?.message}>
									<input id="vehicleDetails" aria-invalid={!!errors.vehicleDetails} {...register('vehicleDetails')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition" placeholder="Year / Make / Model" />
								</Field>
							</div>
						)}

									<div className="grid gap-5 md:grid-cols-3">
										<Field label="Message (Optional)" htmlFor="message" error={errors.message?.message} className="md:col-span-3">
								<textarea id="message" rows={reason === 'price' ? 4 : 5} aria-invalid={!!errors.message} {...register('message')} className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:bg-white dark:focus:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-brand-600/40 transition resize-none" placeholder="Share context or requirements" />
							</Field>
						</div>

									{/* Consent above submit */}
									<div className="space-y-3 mt-1">
										<label className="flex items-start gap-2 text-xs leading-relaxed cursor-pointer select-none">
											<input type="checkbox" {...register('consent')} className="mt-0.5 h-4 w-4 rounded border-neutral-400 bg-white dark:bg-neutral-900/60" />
											<span>I allow this company to use my data.</span>
										</label>
										{errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}
										<p className="text-[10px] leading-snug text-neutral-500 dark:text-neutral-400">Disclaimer: By providing my phone number to My Company, I agree and acknowledge that My Company may send text messages to my wireless phone number for any purpose. Message and data rates may apply. Message frequency will vary, and you will be able to Opt-out by replying &quot;STOP&quot;. For more info view our <Link href="/privacy" className="underline decoration-dotted hover:text-brand-600 dark:hover:text-brand-400">Privacy Policy</Link>.</p>
									</div>

									<div className="flex items-center gap-4 pt-3">
							<button disabled={isSubmitting} className="btn-primary px-6">{isSubmitting ? 'Sending...' : 'Submit'}</button>
							{submitted && <span className="text-sm text-green-600 dark:text-green-400">Sent!</span>}
						</div>
					</form>
				</section>
						<aside className="lg:col-span-2 space-y-4">
					<div className="surface p-5 rounded-xl">
						<div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> Response under 1 business hour</div>
						<div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /> Lower 48 coverage</div>
					</div>
										<div className="relative rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 shadow-soft ring-1 ring-black/5 dark:ring-white/10">
											<Image src="/globe.svg" alt="Coverage map" fill priority className="object-contain p-6 md:p-8" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
								<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,137,255,0.15),transparent_60%)]" />
											{/* sparkle accent */}
											<div className="absolute bottom-3 right-3 h-4 w-4 rotate-45 rounded-sm bg-gradient-to-br from-white/70 to-white/10 backdrop-blur-sm opacity-60" />
								<div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
									<p className="text-sm font-medium">Coverage Map</p>
									<p className="text-xs opacity-80 mt-1">Nationwide network across the lower 48</p>
									<Link href="/track" className="mt-3 inline-flex btn-primary">Track a shipment</Link>
								</div>
							</div>
				</aside>
			</div>
		</main>
	);
}

function Field({ label, htmlFor, error, children, className = '' }: { label: string; htmlFor?: string; error?: string; children: React.ReactNode; className?: string; }) {
	return (
		<div className={className + " space-y-1"}>
			<label htmlFor={htmlFor} className="text-xs uppercase tracking-wide font-medium text-neutral-600 dark:text-neutral-300">{label}</label>
			{children}
			{error && <p className="text-[10px] font-medium text-red-500">{error}</p>}
		</div>
	);
}

function ContactCard({ icon, title, label, href }: { icon: React.ReactNode; title: string; label: string; href: string }) {
	return (
		<a href={href} className="surface p-4 rounded-lg flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition focus-ring">
			<span className="inline-flex p-2 rounded-md bg-brand-600/10 text-brand-600 ring-1 ring-brand-600/20">{icon}</span>
			<div className="min-w-0">
				<p className="text-sm font-medium tracking-tight">{title}</p>
				<p className="text-[12px] text-muted-foreground truncate">{label}</p>
			</div>
		</a>
	);
}

// Shared field class (Tailwind) via global styles could be extracted later
// Using small utility to keep patch focused.
// (Removed unused global interface & inline style utility after inlining classes.)

