import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { useParams } from 'react-router-dom'
import { Layout } from '..'
import { getCredits, getMovieDetail, getVideoMovieDetail } from 'src/utils/api'
import { CreditsData, CreditsDataResponse, MovieDetailData, VideoMovieDataResponse } from 'src/models/api'
import { QUERY_KEYS } from 'src/utils/keys'
import { useQuery } from '@tanstack/react-query'
import { LoadingScreen } from 'src/common/LoadingScreen'
import { IMAGE_URL, IMAGE_WIDTH } from 'src/models/common'
import { convertTime, filterCast } from 'src/utils/common'
import { StarIcon } from 'src/common/CustomIcons'
import { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import {getMovieData} from "../../utils/api/movie";
import {IMovieListData, IMovieListDataResponse} from "../../models/api/movie.interface";

dayjs.extend(utc)

type ParamProps = {
  id: string
}


export const MovieScreen = () => {
    const { id } = useParams<ParamProps>()


  const { data: movie, isLoading: isMovieLoading } = useQuery(
      [QUERY_KEYS.MOVIE_LIST, id],
      async () => {
          try {
              if (id) {
        const response = (await getMovieData({
          id
        })) as IMovieListData;

        if (response) {
          return response
        }
      }
          } catch (error) {
              console.log(error)
          }
      },
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      cacheTime: 5000000,
      enabled: !!id,
    },
  )

  // const { data: videoMovie, isLoading: isVideoMovieLoading } = useQuery(
  //   [QUERY_KEYS.VIDEO_MOVIE, id],
  //   async () => {
  //     if (id) {
  //       const response = (await getVideoMovieDetail({ id })) as VideoMovieDataResponse
  //
  //       if (response) {
  //         return response.results
  //       }
  //     }
  //   },
  //   {
  //     refetchInterval: false,
  //     refetchOnWindowFocus: false,
  //     cacheTime: 5000000,
  //     enabled: !!id,
  //   },
  // )
  //
  // const { data: credits, isLoading: isCreditsLoading } = useQuery(
  //   [QUERY_KEYS.CREDITS_MOVIE, id],
  //   async () => {
  //     try {
  //       if (id) {
  //         const response = (await getCredits({ id })) as CreditsDataResponse
  //
  //         if (response) {
  //           return response
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  //   {
  //     refetchInterval: false,
  //     refetchOnWindowFocus: false,
  //     cacheTime: 5000000,
  //     enabled: !!id,
  //   },
  // )


  if (isMovieLoading) {
    return (
      <div className="w-screen h-screen">
        <LoadingScreen />
      </div>
    )
  }

  return (
    <Layout>
      {movie && (
        <div className="w-full h-fit">
          <div className="w-full h-screen">
            <img
              className="absolute w-full object-cover h-full"
              src={`${IMAGE_URL}/${movie.collectionId}/${movie.id}/${movie.poster}`}
              alt={movie.name ?? 'Image'}
            />
            <div className="absolute w-full h-full bg-[#000000a9] z-10" />
            <div className="relative container lg:w-[1100px] mx-auto z-10 pt-[60px] max-sm:px-[10px]">
              <div className="flex justify-between items-center flex-wrap">
                <div className="text-[#FFFFFF]">
                  <p className="text-[32px]">{movie.name}</p>
                </div>
              </div>
                <div className="mt-[30px] flex flex-wrap h-fit sm:h-[450px] gap-[10px] pb-8">
                    <img
                        className="object-cover h-full max-md:hidden"
                        src={`${IMAGE_URL}/${movie.collectionId}/${movie.id}/${movie.poster}`}
                        alt={movie.name ?? 'Image'}
                    />
                    <div className="w-full md:w-[calc(100%-350px)] pl-4">
                        <p className="text-[#FFFFFF] text-lg">{movie.description}</p>
                    </div>
                </div>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-24 rounded">
                    Xem Phim
                </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
