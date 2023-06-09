const API_KEY: any = process.env.API_KEY
export default {
    fetchTrending: {
        title: "Trending",
        url: `/trending/all/week?api_key=43aca06caf869d7f68a56746725a9dd3&language=en=US`
    },
    fetchTopRated: {
        title: "Top Rated",
        url: `/movie/top_rated?api_key=43aca06caf869d7f68a56746725a9dd3&language=en=US`
    },
    fetchActionMovies: {
        title: "Action",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=28`
    },
    fetchComedyMovies: {
        title: "Comedy",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=35`
    },
    fetchMorrorMovies: {
        title: "Morror",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=27`
    },
    fetchRomanceMovies: {
        title: "Romance",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=10749`
    },
    fetchMystery: {
        title: "Mystery",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=9648`
    },
    fetchSciFi: {
        title: "Sci-Fi",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=878`
    },
    fetchAnimation: {
        title: "Animation",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=16`
    },
    fetchTv: {
        title: "TV Movie",
        url: `/discover/movie?api_key=43aca06caf869d7f68a56746725a9dd3&with_genres=10770`
    },
}
