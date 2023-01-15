import { FunctionComponent } from "react"

import NavbarAuth from "@/components/NavbarAuth"
import styles from "@/components/Layout.module.scss"

type Props = {
  children: JSX.Element
}

const Layout: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav} role="navigation" aria-label="main navigation">
        <NavbarAuth />
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>UI/UX Challenge • Copyright 2023</p>
      </footer>
    </div>
  )
}

export default Layout
