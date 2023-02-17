import React, { useEffect, useState } from 'react';
import { useLazyGetUserReposQuery, useSearchUsersQuery } from "../store/github/github.api";
import { useDebounce } from "../hooks/debounce";
import { RepoCard } from "../components/RepoCard";

const HomePage = () => {
    const [search, setSearch] = useState('')
    const [dropdown, setDropdown] = useState(false)
    const debounced = useDebounce(search)
    const { isLoading, isError, data } = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true
    })

    const [fetchRepos, { isLoading: areReposLoading, data: repos }] = useLazyGetUserReposQuery()

    const clickHandler = (username: string) => {
        fetchRepos(username)
        setDropdown(false)
    }

    useEffect(() => {
        setDropdown(debounced.length > 3 && data?.length! > 0)
    }, [debounced, data])

    return (
        <div className='flex justify-center pt-10 mx-auto h-screen w-screen'>
            {isError && <p className='text-center text-red-600'>Something went wrong...</p>}

            <div className='relative w-[560px]'>
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className='border py-2 px-4 w-full h-[42px] mb-2'
                    type="text"
                    placeholder='Search for Github username...'
                />
                {dropdown &&
                    <ul className='list-none p-2 absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white'>
                        {isLoading && <p className='text-center'>Loading...</p>}
                        {data?.map(user => (
                            <li
                                onClick={() => clickHandler(user.login)}
                                className='py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer'
                                key={user.id}>
                                {user.login}
                            </li>
                        ))}
                    </ul>}
                <div className="container">
                    {areReposLoading && <p className='text-center'>Repos are loading</p>}
                    {repos?.map(repo => (
                        <RepoCard key={repo.id} repo={repo}/>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default HomePage;