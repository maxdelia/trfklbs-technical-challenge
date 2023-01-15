import type { NextPage } from "next"
import { GetStaticProps } from "next"
import { dehydrate, QueryClient, useQuery } from "react-query"

import CommonHead from "@/components/CommonHead"
import Layout from "@/components/Layout"
import Search from "@/components/Search"
import styles from "@/styles/Home.module.scss"
import { searchAsync } from "@/helpers/queries"

const HomePage: NextPage = () => {
  return (
    <>
      <CommonHead />
      <Layout>
        <div className={styles.home}>
          <h1>GitHub Indicators Explorer</h1>
          <h2>GitHub Indicators Explorer can help you get key metrics about your favourite github repositories.</h2>
          <Search />
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  const searchPayload = { query: "user:traefik", page: 1 }
  await queryClient.prefetchQuery(["search", searchPayload], () => searchAsync(searchPayload))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default HomePage
