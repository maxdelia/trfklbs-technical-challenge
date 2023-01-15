import { GetStaticProps } from "next"

import CommonHead from "@/components/CommonHead"
import NavbarAuth from "@/components/NavbarAuth"
import Repository from "@/entities/Repository"
import Search from "@/components/Search"
import styles from "@/styles/Home.module.scss"

export const getStaticProps: GetStaticProps = async () => {
  const staticRepositories = [
    {
      avatarUrl: "/images/github.svg",
      description: "Traefik Mesh - Simpler Service Mesh",
      id: 1,
      name: "traefik/mesh",
    },
    {
      avatarUrl: "/images/github.svg",
      description: "The Cloud Native Application Proxy",
      id: 2,
      name: "traefik/mesh",
    },
    {
      avatarUrl: "/images/github.svg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula fringilla mauris nec mattis.",
      id: 3,
      name: "maxdelia/lipsum",
    },
  ]

  return {
    props: {
      staticRepositories,
    },
  }
}

export default function Home({ staticRepositories }: { staticRepositories: Repository[] }) {
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
          <Search staticRepositories={staticRepositories} />
        </main>
        <footer className={styles.footer}>
          <p>UI/UX Challenge • Copyright 2023</p>
        </footer>
      </div>
    </>
  )
}
