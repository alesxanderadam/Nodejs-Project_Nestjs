'use client'
import { createContext, useContext, Dispatch, SetStateAction, useState } from "react"
import requests from "../../../utils/requests"
import { DataMovie, Result } from "@/models/movie"

interface ContextProps {
    fetchDataMovie: (searchParams: string) => Promise<void>,
    dataMovie: Result[],
    loading: Boolean
}

const GlobalContext = createContext<ContextProps>({
    fetchDataMovie: async (searchParams: string): Promise<void> => { },
    dataMovie: [],
    loading: true
})

export const GlobalContextProvider = ({ children }) => {
    const [dataMovie, setDataMovie] = useState<[] | Result[]>([]);
    const [loading, setLoading] = useState<Boolean>(true)

    const fetchDataMovie = async (searchParams: string) => {
        await fetch(`https://api.themoviedb.org/3/${requests[searchParams]?.url || requests.fetchTrending.url}`)
            .then((res) => res.json())
            .then((res: DataMovie) => {
                setLoading(false);
                setDataMovie(res.results)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
                return;
            });
    };

    return (
        <GlobalContext.Provider value={{ fetchDataMovie, dataMovie, loading }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)



