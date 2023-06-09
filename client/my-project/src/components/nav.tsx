'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import requests from '../../utils/requests';

type Props = {}

const Nav = (props: Props) => {
    const router = useRouter();
    return (
        <nav className='relative'>
            <div className='flex px-10 sm:px-20 text-2xl whitespace-nowrap space-x-10 overflow-scroll scrollbar-hide'>
                {Object.entries(requests).map(([key, { title, url }]) => {
                    return <h2 onClick={() => router.push(`./?genre=${key}`)} className='last:pr-24 cursor-pointer transition duration-100 transform hover:scale-125 hover:text-white active:text-red-500' key={key}>{title}</h2>
                })}
            </div>
            <div className='absolute top-0 right-0 bg-gradient-to-l from-[#0202A] h-10 w-1'></div>
        </nav >
    )
}

export default Nav