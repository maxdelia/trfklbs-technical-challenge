import Image from "next/image"
import Link from "next/link"
import type { NextPage } from "next"
import { GetServerSideProps } from "next"
import { CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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
  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ]

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
          <div className={styles.chart}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <Line type="monotone" dataKey="uv" stroke="rgb(var(--lavender-rgb))" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
