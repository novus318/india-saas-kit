'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative flex flex-row justify-end py-4 align-center md:py-6">
      <div className="flex justify-end space-x-8">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100"
            >
              {/* Fallback Avatar */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200 dark:border-zinc-800">
                <div className="py-1">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                    <p className="text-sm">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">Account Settings</a>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/api/auth/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
