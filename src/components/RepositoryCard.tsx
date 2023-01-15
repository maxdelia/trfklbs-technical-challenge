import Image from "next/image"
import Link from "next/link"
import { FunctionComponent } from "react"

import Repository from "@/entities/Repository"
import styles from "@/components/RepositoryCard.module.scss"

type Props = {
  repository: Repository
}

const RepositoryCard: FunctionComponent<Props> = ({ repository }) => {
  return (
    <div className={styles.repositoryCard} key={repository.id}>
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

export default RepositoryCard
