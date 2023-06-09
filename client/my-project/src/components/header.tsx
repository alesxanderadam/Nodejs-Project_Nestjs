import React from 'react'
import Image from 'next/image'
import HeaderItem from './header-item'
import { BadgeCheckIcon, CollectionIcon, HomeIcon, LightningBoltIcon, SearchIcon, UserIcon } from "@heroicons/react/outline"

type Props = {}

const Header = (props: Props) => {
    return (
        <header className='flex flex-col sm:flex-row m-5 justify-between items-center h-auto'>
            <div className='flex flex-row justify-evenly max-w-2xl'>
                <HeaderItem title="HOME" Icon={HomeIcon} />
                <HeaderItem title="TRENDING" Icon={LightningBoltIcon} />
                <HeaderItem title="VERIFIED" Icon={BadgeCheckIcon} />
                <HeaderItem title="COLLECTION" Icon={CollectionIcon} />
                <HeaderItem title="SEARCH" Icon={SearchIcon} />
                <HeaderItem title="ACCOUNT" Icon={UserIcon} />
            </div>
            <Image src="https://links.papareact.com/ua6" alt='logo' width={200} height={100} />
        </header>
    )
}

export default Header