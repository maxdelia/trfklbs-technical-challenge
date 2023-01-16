import Image from "next/image"
import Link from "next/link"
import type { NextPage } from "next"
import { GetServerSideProps } from "next"
import { Octokit } from "octokit"
import { ParsedUrlQuery } from "querystring"

import CommonHead from "@/components/CommonHead"
import Layout from "@/components/Layout"
import Repository from "@/entities/Repository"
import RepositoryStats from "@/entities/RepositoryStats"
import styles from "./stats.module.scss"

type StatsPageProps = {
  repository: Repository
  stats: Partial<RepositoryStats>
}

const StatsPage: NextPage<StatsPageProps> = ({ repository, stats }) => {
  return (
    <>
      <CommonHead />
      <Layout>
        <div className={styles.stats}>
          <div className={styles.goBack}>
            <Link href="/">Choose another repository</Link>
          </div>
          <div className={styles.title}>
            <Image src={repository.avatarUrl} alt="" className={styles.avatar} height={60} width={60} priority />
            <h1>{repository.name}</h1>
          </div>
          <h2>{repository.description}</h2>
        </div>
      </Layout>
    </>
  )
}

interface StatsPageParams extends ParsedUrlQuery {
  owner: string
  repo: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { owner, repo } = params as StatsPageParams
  const octokit = new Octokit()
  const {
    data: {
      id,
      description,
      owner: { avatar_url: avatarUrl },
    },
  } = await octokit.rest.repos.get({
    owner,
    repo,
  })
  const repository: Repository = {
    avatarUrl,
    description: description || "No description.",
    id,
    name: `${owner}/${repo}`,
  }
  const stats: Partial<RepositoryStats> = {}

  return { props: { repository, stats } }
}

export default StatsPage
