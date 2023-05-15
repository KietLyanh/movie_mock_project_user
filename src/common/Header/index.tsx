import { useCallback, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import debounce from 'lodash.debounce'
import {MenuIcon, PlayIcon, SearchIcon} from '../CustomIcons'
import {IMAGE_URL, MenuHeader} from 'src/models/common'
import { MENU_HEADER, SELECT_SEARCH, SelectSearch } from 'src/utils/common'
import { useClickOutside } from 'src/hooks/useClickOutSide'

export const Header = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const contentRef = useRef() as any
  const childRef = useRef() as any
  useClickOutside(contentRef, childRef, (value: boolean) => setIsOpenMenu(value))

  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>(searchParams.get('q') ?? '');
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(5);

  const debounceKeyword = (keyword: string) => {
    setKeyword(keyword)
    navigate({
      pathname: '/search',
      search: `?&q=${keyword}`,
    })
  }

  const debounceInput = useCallback(
    debounce((keyword: string) => debounceKeyword(keyword), 1000),
    [],
  )

  const onChangeKeyword = (event: { target: { value: string } }) => {
    debounceInput(event.target.value)
  }


  return (
    <div className="w-full fixed top-0 left-0 bg-[#000] z-100">
      <div
        className="w-[calc(100%-20px)] sm:container md:w-[1100px] flex justify-between mx-auto items-center h-[50px]"
        ref={contentRef}
      >
        <Link to={'/'} className="text-[#000] font-extrabold bg-yellow-500 px-[10px] py-[5px]">
          Movie
        </Link>
        <ul className="hidden md:flex text-[#FFFFFF] items-center w-fit gap-[30px] pr-28">
          <li className="rounded-md overflow-hidden bg-[#FFFFFF] flex gap-[10px] w-[400px]">
            <div className="flex flex-1 items-center px-[10px] border-l-[1px] border-[#808080]">
              <input
                placeholder="Search keyword"
                className="h-[35px] flex-1 outline-none border-none text-[#000] text-[14px]"
                onChange={onChangeKeyword}
                defaultValue={keyword}
              />
              <SearchIcon width={20} height={20} color="#000" />
            </div>
          </li>
          {MENU_HEADER.map((item: MenuHeader) => (
            <li key={`${item.name}_${item.id}`}>
              <NavLink to={item.path} replace>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
