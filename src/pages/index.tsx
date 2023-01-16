import type { NextPage } from "next"
import { GetStaticProps } from "next"
import { Octokit } from "octokit"
import { dehydrate, QueryClient, useQuery } from "react-query"

import CommonHead from "@/components/CommonHead"
import Layout from "@/components/Layout"
import Search from "@/components/Search"
import styles from "./index.module.scss"
import { fromApi } from "@/adapters/repositoryAdapter"

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
  const octokit = new Octokit()
  const queryClient = new QueryClient()

  const searchPayload = { query: "user:traefik", page: 1 }
  await queryClient.prefetchQuery(["search", searchPayload], async () => {
    const {
      data: { items, total_count },
    } = await octokit.rest.search.repos({
      q: searchPayload.query,
      sort: "stars",
      per_page: 3,
      page: searchPayload.page,
    })
    return Promise.resolve({ items: items.map(fromApi), hasMore: total_count > 3 })
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default HomePage
