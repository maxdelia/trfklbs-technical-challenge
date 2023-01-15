import Image from "next/image"
import Link from "next/link"
import { FunctionComponent } from "react"

import styles from "@/components/Search.module.scss"
import Repository from "@/entities/Repository"

type Props = {
  staticRepositories?: Repository[]
}

const Search: FunctionComponent<Props> = ({ staticRepositories }) => {
  const repositories = staticRepositories || []

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

  return (
    <div className={styles.search}>
      <h3>Select a repository</h3>
      <input name="query" placeholder="Search…" type="search" />
      <div className={styles.results}>
        {repositories.length ? (
          <>
            {repositories.map(getRepositoryCard)}
            <div className={styles.more}>
              <button type="button">Load more</button>
            </div>
          </>
        ) : undefined}
      </div>
    </div>
  )
}

export default Search
