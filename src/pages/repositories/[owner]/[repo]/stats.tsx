import Image from "next/image"
import Link from "next/link"
import type { NextPage } from "next"
import { CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { GetServerSideProps } from "next"
import { Octokit } from "octokit"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"

import BigChip from "@/components/BigChip"
import CommonHead from "@/components/CommonHead"
import Layout from "@/components/Layout"
import Repository from "@/entities/Repository"
import StatsDatum from "@/entities/StatsDatum"
import styles from "./stats.module.scss"
import { GenericQueryError, StatsResult, statsAsync } from "@/helpers/queries"

type StatsPageProps = {
  repository: Repository
}

const StatsPage: NextPage<StatsPageProps> = ({ repository }) => {
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
  const [ownerRepo, setOwnerRepo] = useState(repository.name.split("/"))
  const [chartData, setChartData] = useState<StatsDatum[]>([])

  const {
    data: queryData,
    error: queryError,
    status: queryStatus,
  } = useQuery<StatsResult, GenericQueryError>(["stats", { owner: ownerRepo[0], repo: ownerRepo[1] }], () =>
    statsAsync({ owner: ownerRepo[0], repo: ownerRepo[1] })
  )

  const [metrics, setMetrics] = useState(
    typeof router.query.metrics !== "undefined"
      ? router.query.metrics
          .toString()
          .split(",")
          .filter((x) => x)
      : ["openIssues"]
  )

  useEffect(() => {
    if (queryData) setChartData(queryData.items)
  }, [queryData])

  useEffect(() => {
    setOwnerRepo(repository.name.split("/"))
  }, [repository])

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
              <LineChart data={chartData}>
                {getChartLines()}
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
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
  return { props: { repository } }
}

export default StatsPage
