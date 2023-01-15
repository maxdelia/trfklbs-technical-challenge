import Image from "next/image"
import Link from "next/link"
import { FunctionComponent, useEffect, useRef, useState } from "react"

import LoadMore from "@/components/LoadMore"
import Repository from "@/entities/Repository"
import styles from "@/components/Search.module.scss"
import useDebounce from "@/hooks/useDebounce"

type Props = {
  staticRepositories?: Repository[]
}

const Search: FunctionComponent<Props> = ({ staticRepositories }) => {
  const searchRef = useRef<null | HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [repositories, setRepositories] = useState(staticRepositories || [])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const debouncedSearchQuery: string = useDebounce<string>(searchQuery, 300)

  const getRepositoryCard = (repository: Repository) => {
    return (
      <div className={styles.card} key={repository.id}>
        <div className={styles.repository}>
          <Image src={repository.avatarUrl} alt="" className={styles.avatar} height={44} width={44} priority />
          <div className={styles.details}>
            <span className={styles.name}>{repository.name}</span>
            <span className={styles.description}>{repository.description}</span>
          </div>
        </div>
        <div className={styles.select}>
          <Link href={`/stats/${repository.name}`}>select</Link>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true)
      setTimeout(() => {
        console.log(debouncedSearchQuery)
        if (staticRepositories) setRepositories(staticRepositories)
        setIsLoading(false)
      }, 1000)
    } else {
      if (staticRepositories) setRepositories(staticRepositories)
    }
  }, [debouncedSearchQuery, staticRepositories])

  return (
    <div className={styles.search} ref={searchRef}>
      <h3>Select a repository</h3>
      <input
        name="query"
        onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
        placeholder="Search…"
        type="search"
      />
      <div className={styles.results}>{repositories.length ? repositories.map(getRepositoryCard) : undefined}</div>
      {hasMore && !isLoading ? (
        <div className={styles.more}>
          <LoadMore
            onClick={() => {
              setIsLoadingMore(true)
              setTimeout(() => {
                const fakeId = +new Date()
                setRepositories([
                  ...repositories,
                  { ...repositories[0], id: fakeId },
                  { ...repositories[1], id: fakeId + 1 },
                  { ...repositories[2], id: fakeId + 2 },
                ])
                setIsLoadingMore(false)
                setTimeout(() => {
                  searchRef?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
                }, 200)
              }, 1000)
            }}
            isLoading={isLoadingMore}
          />
        </div>
      ) : undefined}
    </div>
  )
}

export default Search
