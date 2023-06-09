'use client'
import { useGlobalContext } from '@/app/Context/store';
import React from 'react'
import Thumbnail from './thumbnail';
import FlipMove from 'react-flip-move';
import Loading from './loading/loading';

type Props = {}

const Result = (props: Props) => {
    const { dataMovie, loading } = useGlobalContext();
    return (
        loading ? <Loading /> : <FlipMove className='px-5 my-10 grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4'>
            {dataMovie?.map((e) => <Thumbnail key={e.id} result={e} />)}
        </FlipMove>

    )
}

export default Result