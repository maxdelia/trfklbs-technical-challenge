import { FunctionComponent } from "react"

import styles from "@/components/LoadMore.module.scss"

type Props = {
  isLoading: boolean
  onClick: () => void
}

const LoadMore: FunctionComponent<Props> = ({ isLoading, onClick }) => {
  return (
    <button className={styles.loadMore} onClick={onClick} type="button">
      {isLoading ? "Loading…" : "Load more"}
    </button>
  )
}

export default LoadMore
