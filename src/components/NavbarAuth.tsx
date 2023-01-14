import Image from "next/image"
import { FunctionComponent } from "react"

import styles from "@/components/NavbarAuth.module.scss"

type Props = {
  avatarUrl?: string
  username?: string
}

const NavbarAuth: FunctionComponent<Props> = ({ avatarUrl, username }) => {
  return (
    <div className={styles.auth}>
      <div className={styles.user}>
        <span className={styles.name}>{username || "Anonymous"}</span>
        <span className={styles.connect}>{username ? "Disconnect" : "Connect with Github"}</span>
      </div>
      <Image
        src={avatarUrl || "/images/github.svg"}
        alt={username ? `${username}'s avatar` : "GitHub logo"}
        className={styles.avatar}
        height={44}
        width={44}
        priority
      />
    </div>
  )
}

export default NavbarAuth
