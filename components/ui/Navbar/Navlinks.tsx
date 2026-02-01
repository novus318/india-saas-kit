'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Logo from '@/components/icons/Logo';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/" className={s.link}>
            Pricing
          </Link>
          {user && (
            <div className={s.link}>
              Account
            </div>
          )}
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <button onClick={() => signOut()} className={s.link}>
            Sign out
          </button>
        ) : (
          <Link href="/api/auth/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
