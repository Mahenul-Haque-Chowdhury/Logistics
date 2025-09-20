"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
	return (
		<header className="w-full border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/80 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
			<div className="container h-16 flex items-center gap-4">
				{/* Left: Logo */}
				<div className="flex items-center">
					<Link href="/" className="font-bold text-lg tracking-tight font-heading" onClick={close}>
						<span className="text-brand-600">Omuk</span>&nbsp;Logistics
					</Link>
				</div>
				{/* Middle: Centered nav (absolute centering within relative container) */}
				<div className="relative flex-1 h-full">
					<nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						{links.map(l => {
							const active = pathname === l.href;
							return (
								<Link key={l.href} href={l.href} className="relative px-0.5" onClick={close}>
									<span className={"transition-colors hover:text-brand-600 " + (active ? "text-brand-600" : "text-neutral-600 dark:text-neutral-300")}>{l.label}</span>
									{active && <motion.span layoutId="nav-active" className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand-600" />}
								</Link>
							);
						})}
					</nav>
				</div>
				{/* Right: Utilities */}
				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Link href="/quote" className="hidden sm:inline-flex btn-primary h-10 px-5 text-sm font-medium whitespace-nowrap leading-none" onClick={close}>Request Quote</Link>
					<button className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-neutral-300 dark:border-neutral-700" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">
						{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
					</button>
				</div>
			</div>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
						className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
					>
						<div className="container py-4 flex flex-col gap-2 text-sm font-medium">
							{links.map(l => {
								const active = pathname === l.href;
								return (
									<Link key={l.href} href={l.href} onClick={close} className={"flex items-center justify-between rounded-md px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 " + (active ? 'text-brand-600' : 'text-neutral-700 dark:text-neutral-300') }>
										{l.label}
										{active && <span className="w-2 h-2 rounded-full bg-brand-600" />}
									</Link>
								);
							})}
							<Link href="/quote" onClick={close} className="mt-2 btn-primary inline-flex justify-center h-11 text-sm font-medium whitespace-nowrap leading-none">Request Quote</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
