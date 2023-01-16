import { FunctionComponent, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"

import LoadMore from "@/components/LoadMore"
import Repository from "@/entities/Repository"
import RepositoryCard from "@/components/RepositoryCard"
import styles from "@/components/Search.module.scss"
import useDebounce from "@/hooks/useDebounce"
import { GenericQueryError, searchAsync, SearchResult } from "@/helpers/queries"

const Search: FunctionComponent = () => {
  const searchRef = useRef<null | HTMLDivElement>(null)

  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("user:traefik")
  const [repositories, setRepositories] = useState<Repository[]>([])

  const debouncedQuery: string = useDebounce<string>(query, 500)
  const {
    data: queryData,
    error: queryError,
    status: queryStatus,
  } = useQuery<SearchResult, GenericQueryError>(["search", { query: debouncedQuery || "user:traefik", page }], () =>
    searchAsync({ query: debouncedQuery || "user:traefik", page })
  )

  useEffect(() => {
    setPage(1)
  }, [debouncedQuery])

  useEffect(() => {
    if (queryData) {
      setHasMore(queryData.hasMore)
      setIsLoadingMore(false)
      if (page < 2) setRepositories(queryData.items)
      else setRepositories((currentValue) => [...currentValue, ...queryData.items])

      setTimeout(() => {
        searchRef?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
      }, 200)
    }
  }, [page, queryData])

  const mapRepository = (isLoading: boolean, repository: Repository) => (
    <RepositoryCard key={repository.id} isLoading={isLoading} repository={repository} />
  )

  const getResults = (queryStatus: string) => {
    switch (queryStatus) {
      case "error":
        return <p className="error">{queryError?.message}</p>
      case "loading":
        return Array.from(Array(repositories.length || 3).keys()).map((id) =>
          mapRepository(true, { avatarUrl: "", description: "", id, name: "" })
        )
      default:
        return repositories.length ? (
          repositories.map((repository) => mapRepository(false, repository))
        ) : (
          <p>No results.</p>
        )
    }
  }

  return (
    <div className={styles.search} ref={searchRef}>
      <h3>Select a repository</h3>
      <input
        name="query"
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          setQuery(e.currentTarget.value)
        }}
        placeholder="Search…"
        type="search"
      />
      <div className={styles.results}>{getResults(queryStatus)}</div>
      {hasMore && !queryError ? (
        <div className={styles.more}>
          <LoadMore
            onClick={() => {
              setIsLoadingMore(true)
              setPage(page + 1)
            }}
            isLoading={isLoadingMore}
          />
        </div>
      ) : undefined}
    </div>
  )
}

export default Search
