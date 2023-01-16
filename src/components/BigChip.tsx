import { FunctionComponent } from "react"

import styles from "./BigChip.module.scss"

type Props = {
  activeBgColor: string
  isActive?: boolean
  label: string
  onClick: () => void
}

const BigChip: FunctionComponent<Props> = ({ activeBgColor, isActive, label, onClick }) => {
  return (
    <button
      className={`${styles.bigChip} ${isActive ? styles.active : ""}`.trim()}
      onClick={onClick}
      style={isActive ? { backgroundColor: activeBgColor } : undefined}
      type="button"
    >
      {label}
    </button>
  )
}

BigChip.defaultProps = {
  isActive: false,
}

export default BigChip
