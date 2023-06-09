'use client'
import { useEffect } from "react"
import { useGlobalContext } from "./Context/store"
import Result from "@/components/result"
import Loading from "@/components/loading/loading"

type Props = {
    searchParams: {
        genre: string
    }
}
export default function HomeMaster({ searchParams }: Props) {
    const { fetchDataMovie, loading } = useGlobalContext();
    useEffect(() => {
        fetchDataMovie(searchParams.genre)
    }, [searchParams])
    return <>
        {loading ? <Loading /> : <Result />}
    </>
}

