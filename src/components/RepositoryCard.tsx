import Image from "next/image"
import Link from "next/link"
import { FunctionComponent } from "react"

import Repository from "@/entities/Repository"
import styles from "@/components/RepositoryCard.module.scss"

type Props = {
  isLoading?: boolean
  repository: Repository
}

const RepositoryCard: FunctionComponent<Props> = ({ isLoading, repository }) => {
  return (
    <div className={styles.repositoryCard} key={repository.id}>
      <div className={styles.repository}>
        {isLoading ? (
          <div className={styles.avatarPh}></div>
        ) : (
          <Image src={repository.avatarUrl} alt="" className={styles.avatar} height={44} width={44} priority />
        )}
        <div className={styles.details}>
          {isLoading ? <div className={styles.namePh}></div> : <span className={styles.name}>{repository.name}</span>}
          {isLoading ? (
            <div className={styles.descriptionPh}></div>
          ) : (
            <span className={styles.description}>{repository.description}</span>
          )}
        </div>
      </div>
      <div className={styles.select}>
        <Link href={`/stats/${repository.name}`}>select</Link>
      </div>
    </div>
  )
}

RepositoryCard.defaultProps = {
  isLoading: false,
}

export default RepositoryCard
