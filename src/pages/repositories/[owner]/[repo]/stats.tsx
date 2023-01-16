import Image from "next/image"
import Link from "next/link"
import type { NextPage } from "next"
import { CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { GetServerSideProps } from "next"
import { Octokit } from "octokit"
import { ParsedUrlQuery } from "querystring"
import { useRouter } from "next/router"
import { useState } from "react"

import CommonHead from "@/components/CommonHead"
import Layout from "@/components/Layout"
import Repository from "@/entities/Repository"
import RepositoryStats from "@/entities/RepositoryStats"
import styles from "./stats.module.scss"
import BigChip from "@/components/BigChip"

type StatsPageProps = {
  repository: Repository
  stats: Partial<RepositoryStats>
}

const StatsPage: NextPage<StatsPageProps> = ({ repository, stats }) => {
  const availableMetrics = ["openIssues", "collaborators"]
  const metricToColor: Record<string, string> = {
    collaborators: "rgb(var(--pink-rgb))",
    openIssues: "rgb(var(--lavender-rgb))",
  }
  const metricToLabel: Record<string, string> = {
    collaborators: "Collaborators",
    openIssues: "Open issues",
  }

  const router = useRouter()
  const [metrics, setMetrics] = useState(
    typeof router.query.metrics !== "undefined"
      ? router.query.metrics
          .toString()
          .split(",")
          .filter((x) => x)
      : ["openIssues"]
  )

  const data = [
    { name: "Page A", openIssues: 4000, collaborators: 2400 },
    { name: "Page B", openIssues: 3000, collaborators: 1398 },
    { name: "Page C", openIssues: 2000, collaborators: 9800 },
    { name: "Page D", openIssues: 2780, collaborators: 3908 },
    { name: "Page E", openIssues: 1890, collaborators: 4800 },
    { name: "Page F", openIssues: 2390, collaborators: 3800 },
    { name: "Page G", openIssues: 3490, collaborators: 4300 },
  ]

  const getChartLines = () => {
    return metrics.map((key) => (
      <Line
        dataKey={key}
        key={key}
        stroke={metricToColor[key] || "rgb(var(--foreground-rgb))"}
        strokeWidth={3}
        type="monotone"
      />
    ))
  }

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
          <div className={styles.chartOptions}>
            {availableMetrics.map((metric) => (
              <BigChip
                activeBgColor={metricToColor[metric]}
                isActive={metrics.includes(metric)}
                key={metric}
                label={metricToLabel[metric]}
                onClick={() => {
                  let newMetrics
                  if (!metrics.includes(metric)) newMetrics = [...metrics, metric]
                  else newMetrics = metrics.filter((k) => k !== metric)
                  setMetrics(newMetrics)
                  router.replace({
                    query: { ...router.query, metrics: newMetrics.join(",") },
                  })
                }}
              />
            ))}
          </div>
          <div className={styles.chart}>
            <ResponsiveContainer>
              <LineChart data={data}>
                {getChartLines()}
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
