import type { NextPage } from "next"
import { GetServerSideProps } from "next"
import { ParsedUrlQuery } from "querystring"

import CommonHead from "@/components/CommonHead"
import Layout from "@/components/Layout"
import RepositoryStats from "@/entities/RepositoryStats"
import styles from "@/styles/Home.module.scss"

type StatsPageProps = {
  repositoryStats: Partial<RepositoryStats>
}

const StatsPage: NextPage<StatsPageProps> = ({ repositoryStats }) => {
  return (
    <>
      <CommonHead />
      <Layout>
        <div className={styles.home}>
          <h1>{repositoryStats.name}</h1>
          <h2>{repositoryStats.description}</h2>
        </div>
      </Layout>
    </>
  )
}

interface StatsPageParams extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as StatsPageParams
  const repositoryStats: Partial<RepositoryStats> = {
    name: `${id}`,
    description: "Description",
  }

  return { props: { repositoryStats } }
}

export default StatsPage
