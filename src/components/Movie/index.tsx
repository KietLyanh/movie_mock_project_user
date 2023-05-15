import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import {Link, useParams} from 'react-router-dom'
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
    const splitactor = movie?.actor.split(",");

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
                      src={`${movie.poster}`}
                      alt={movie.name ?? 'Image'}
                  />
                  <div className="absolute w-full h-full bg-[#000000a9] z-10" />
                  <div className="relative container lg:w-[1100px] mx-auto z-10 pt-[60px] max-sm:px-[10px]">
                      <div className="flex justify-between items-center flex-wrap">
                          <div className="text-[#FFFFFF]">
                              <p className="text-[32px]">{movie.name}</p>
                          </div>
                          {/*<div className="flex gap-[30px] max-md:mt-[20px]">*/}
                          {/*    <div className="flex flex-col gap-[5px]">*/}
                          {/*        <p className="text-[20px] text-[#808080] font-semibold text-center uppercase">The Rating</p>*/}
                          {/*        <div className="flex items-center gap-[6px] text-[#808080] font-semibold">*/}
                          {/*            <StarIcon width={48} height={48} />*/}
                          {/*            <div>*/}
                          {/*                <p>*/}
                          {/*                    <span className="text-[#FFFFFF]">{movie.vote_average}</span>/10*/}
                          {/*                </p>*/}
                          {/*                <p>{movie.vote_count}</p>*/}
                          {/*            </div>*/}
                          {/*        </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="flex flex-col gap-[5px]">*/}
                          {/*        <p className="text-[20px] text-[#808080] font-semibold text-center uppercase">Popularity</p>*/}
                          {/*        <p className="text-[20px] text-center text-[#FFFFFF]">{movie.popularity}</p>*/}
                          {/*    </div>*/}
                          {/*</div>*/}
                      </div>
                          <div className="mt-[30px] flex flex-wrap h-fit sm:h-[450px] gap-[10px]">
                              <img
                                  className="object-cover h-full max-md:hidden"
                                  src={`${movie.poster}`}
                                  alt={movie.name ?? 'Image'}
                              />
                              <iframe
                                  src={`${movie.video}`}
                                  className="md:flex-1 max-md:w-full h-full cursor-pointer max-sm:h-[200px] mx-auto"
                                  title={movie.name}
                              />
                          </div>
                      <div className="mt-[15px] max-sm:px-[10px] pb-9">
                          <div className="flex gap-[15px] flex-wrap">
                                  <p className="px-[20px] text-center py-[5px] border-[#808080] text-[#FFFFFF] border-[1px] rounded-full">
                                      {movie.category}
                                  </p>
                          </div>
                          <div className="mt-[10px] flex gap-[20px]">
                              <div className="w-full md:w-[calc(100%-350px)] max-sm:block max-md:flex">
                                  <p className="text-[#FFFFFF] max-md:block max-sm:text-[12px]">{movie.description}</p>
                                  <div className="mt-[5px]">
                                      <div className="flex items-center gap-[20px] text-[#FFFFFF] border-[#FFFFFF] border-b-[1px] pb-[5px]">
                                          <p className="text-[15px] md:text-[22px] font-semibold">Actors: </p>
                                          <div className="flex items-center gap-[10px]">
                                                  <div className="flex items-center gap-[10px]">
                                                      <p className="max-md:text-[10px]">
                                                          {splitactor}
                                                      </p>
                                                      <div className="w-[2px] h-[2px] bg-[#FFFFFF]" />
                                                  </div>
                                          </div>
                                      </div>
                                  {/*    <div className="flex mt-[10px] items-center gap-[20px] text-[#FFFFFF] border-[#FFFFFF] border-b-[1px] pb-[5px]">*/}
                                  {/*        <p className="text-[15px] md:text-[22px] font-semibold">Writers: </p>*/}
                                  {/*        <div className="flex items-center gap-[10px]">*/}
                                  {/*            {departments.writer.map((writer: string, index: number) => (*/}
                                  {/*                <div className="flex items-center gap-[10px]">*/}
                                  {/*                    <p className="max-md:text-[10px]" key={index}>*/}
                                  {/*                        {writer}*/}
                                  {/*                    </p>*/}
                                  {/*                    <div className="w-[2px] h-[2px] bg-[#FFFFFF]" />*/}
                                  {/*                </div>*/}
                                  {/*            ))}*/}
                                  {/*        </div>*/}
                                  {/*    </div>*/}
                                  {/*    <div className="flex mt-[10px] items-center gap-[20px] text-[#FFFFFF] border-[#FFFFFF] border-b-[1px] pb-[5px]">*/}
                                  {/*        <p className="text-[15px] md:text-[22px] font-semibold">Stars: </p>*/}
                                  {/*        <div>*/}
                                  {/*            {departments.actors.map((actor: string, index: number) => (*/}
                                  {/*                <div className="flex items-center gap-[10px]">*/}
                                  {/*                    <p className="max-md:text-[10px]" key={index}>*/}
                                  {/*                        {actor}*/}
                                  {/*                    </p>*/}
                                  {/*                    <div className="w-[2px] h-[2px] bg-[#FFFFFF]" />*/}
                                  {/*                </div>*/}
                                  {/*            ))}*/}
                                  {/*        </div>*/}
                                  {/*    </div>*/}
                                  </div>
                              </div>
                              {/*<div className="w-[350px] bg-[#FFFFFF] p-[10px] max-md:hidden">*/}
                              {/*    <div className="text-[#000] text-[22px] text-center font-semibold ">Co-operation Companies</div>*/}
                              {/*    <div className="flex gap-[30px] flex-wrap mt-[10px] items-center">*/}
                              {/*        {movie.production_companies.map(*/}
                              {/*            (company: { id: number; logo_path: string; name: string; origin_country: string }) => (*/}
                              {/*                <div className="relative group w-fit h-fit cursor-pointer" key={company.id}>*/}
                              {/*                    <LazyLoadImage*/}
                              {/*                        src={`${IMAGE_URL}/${IMAGE_WIDTH.W92}/${company.logo_path}`}*/}
                              {/*                        alt={movie.title ?? 'Image'}*/}
                              {/*                        className=""*/}
                              {/*                    />*/}
                              {/*                    <div className="group-hover:block py-[2px] px-[5px] text-[12px] w-fit absolute z-20 hidden top-[-20px] left-[50%] bg-[#FFFFFF]">*/}
                              {/*                        {company.name}*/}
                              {/*                    </div>*/}
                              {/*                </div>*/}
                              {/*            ),*/}
                              {/*        )}*/}
                              {/*    </div>*/}
                              {/*</div>*/}
                          </div>
                      </div>
                      <Link to={`/watch/${movie.id}`} className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-24 rounded">
                          Xem Phim
                      </Link>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  )
}
