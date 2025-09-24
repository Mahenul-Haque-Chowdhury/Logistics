"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_NAME } from '@/lib/brand';

const links: { href: string; label: string }[] = [
	{ href: "/services", label: "Services" },
	{ href: "/track", label: "Track" },
	{ href: "/quote", label: "Quote" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" }
];

export function Navbar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	function close() { setOpen(false); }

	// Prevent body scroll when mobile menu open
	useEffect(()=>{
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	},[open]);
	return (
		<header className="w-full border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
			<div className="container h-16 flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
				{/* Left: Logo (responsive shrink) */}
				<div className="flex items-center flex-shrink min-w-0 max-w-[50vw] xs:max-w-[42vw] sm:max-w-none">
					<Link href="/" className="font-bold tracking-tight font-heading leading-none whitespace-nowrap text-[1.02rem] sm:text-lg md:text-xl truncate" onClick={close}>
						{/* Stylize first token if it matches expected pattern */}
						{BRAND_NAME.includes(' ') ? (
							<span>
								<span className="text-brand-600">{BRAND_NAME.split(' ')[0]}</span>{' '}{BRAND_NAME.split(' ').slice(1).join(' ')}
							</span>
						) : (
							<span className="text-brand-600">{BRAND_NAME}</span>
						)}
					</Link>
				</div>
				{/* Middle: Centered nav (absolute centering within relative container) */}
				<div className="relative flex-1 h-full">
					<nav className="hidden md:flex items-center gap-6 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						{links.map(l => {
							const active = pathname === l.href;
							return (
								<Link
									key={l.href}
									href={l.href}
									aria-current={active ? 'page' : undefined}
									className={`relative px-2 py-1 rounded-md transition-colors focus-ring ${active ? 'text-brand-600' : 'text-neutral-600 dark:text-neutral-300 hover:text-brand-600'}`}
									onClick={close}
								>
									<span className="relative z-10">{l.label}</span>
									{active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-brand-600/10" transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }} />}
								</Link>
							);
						})}
					</nav>
				</div>
				{/* Right: Utilities */}
				<div className="flex items-center gap-3 flex-shrink-0">
					<ThemeToggle />
					<Link href="/quote" className="hidden md:inline-flex btn-primary h-10 px-5 text-sm font-medium whitespace-nowrap leading-none" onClick={close}>Request Quote</Link>
					<button
						className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-neutral-300 dark:border-neutral-700 focus-ring"
						onClick={()=>setOpen(o=>!o)}
						aria-label="Toggle menu"
						aria-expanded={open}
						aria-controls="mobile-nav"
					>
						{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
				</div>
			</div>
			<AnimatePresence>
				{open && (
					<motion.div
						id="mobile-nav"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
						className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur"
					>
						<div className="container py-4 flex flex-col gap-2 text-sm font-medium">
							{links.map(l => {
								const active = pathname === l.href;
								return (
									<Link
										key={l.href}
										href={l.href}
										onClick={close}
										className={`flex items-center justify-between rounded-md px-2 py-2 focus-ring transition-colors ${active ? 'text-brand-600 bg-brand-600/5' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
									>
										{l.label}
										{active && <span className="w-2 h-2 rounded-full bg-brand-600" />}
									</Link>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
