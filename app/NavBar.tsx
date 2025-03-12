'use client';

import Link from 'next/link'
import React from 'react';
import { usePathname } from 'next/navigation';
import { FaBug } from "react-icons/fa";
import classNames from 'classnames';

const NavBar = () => {
    const currentPath = usePathname();
    const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Issues', href: '/issues' },
    ]
    return (
        <nav className='flex justify-between items-center p-4 h-12 bg-gray-800 text-white'>
            <Link href="/"><FaBug /></Link>
            <ul className='flex space-x-4 pr-10'>
                {links.map(link => <Link key={link.href}
                    href={link.href}
                    className={classNames({
                        'text-white': currentPath === link.href,
                        'text-gray-400': currentPath !== link.href,
                        'hover:text-white transition-colors': true
                    })} >
                    {link.label}</Link>)}
            </ul>
        </nav>
    )
}

export default NavBar
