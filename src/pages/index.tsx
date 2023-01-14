import CommonHead from "@/components/CommonHead"
import NavbarAuth from "@/components/NavbarAuth"
import styles from "@/styles/Home.module.scss"

export default function Home() {
  return (
    <>
      <CommonHead />
      <div className="container">
        <nav className={styles.nav} role="navigation" aria-label="main navigation">
          <NavbarAuth />
        </nav>
        <main className={styles.main}>
          <h1>GitHub Indicators Explorer</h1>
          <h2>GitHub Indicators Explorer can help you get key metrics about your favourite github repositories.</h2>
        </main>
        <footer className={styles.footer}>
          <p>UI/UX Challenge • Copyright 2023</p>
        </footer>
      </div>
    </>
  )
}
