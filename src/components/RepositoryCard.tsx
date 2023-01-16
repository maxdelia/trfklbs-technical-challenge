import Image from "next/image"
import Link from "next/link"
import { FunctionComponent } from "react"
import { useRouter } from "next/router"

import Repository from "@/entities/Repository"
import styles from "@/components/RepositoryCard.module.scss"

type Props = {
  isLoading?: boolean
  repository: Repository
}

const RepositoryCard: FunctionComponent<Props> = ({ isLoading, repository }) => {
  const router = useRouter()

  return (
    <div
      className={styles.repositoryCard}
      key={repository.id}
      onClick={() => router.push(`/repositories/${repository.name}/stats`)}
    >
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
        {repository.name ? <Link href={`/repositories/${repository.name}/stats`}>select</Link> : undefined}
      </div>
    </div>
  )
}

RepositoryCard.defaultProps = {
  isLoading: false,
}

export default RepositoryCard
