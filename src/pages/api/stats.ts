import type { NextApiRequest, NextApiResponse } from "next"
import { Octokit } from "octokit"
import { format, isAfter, isBefore, subWeeks } from "date-fns"

import StatsDatum from "@/entities/StatsDatum"

export type SearchError = {
  message: string
  parameter?: string
}

export type SearchResponse = {
  items: StatsDatum[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchError | SearchResponse>) {
  try {
    const { owner, repo } = req.query
    if (!owner || typeof owner !== "string") {
      res.status(400).json({ message: "Invalid query parameter", parameter: "owner" })
      return
    }
    if (!repo || typeof repo !== "string") {
      res.status(400).json({ message: "Invalid query parameter", parameter: "repo" })
      return
    }
    const octokit = new Octokit({ retry: { enabled: false }, throttle: { enabled: false } })
    const results = await Promise.all([
      octokit.request(`GET /repos/${owner}/${repo}/issues`, { per_page: 100 }),
      octokit.request(`GET /repos/${owner}/${repo}/stats/participation`),
    ])
    const { data: openIssues } = results[0]
    const {
      data: { all: allCommits, owner: ownerCommits },
    } = results[1]
    const now = new Date()
    const weeks = 10
    const allCommitsPartial = allCommits.reverse().slice(0, weeks)
    const ownerCommitsPartial = ownerCommits.reverse().slice(0, weeks)
    const items: StatsDatum[] = allCommitsPartial.map((value: number, index: number) => {
      return {
        date: format(subWeeks(now, index), "yy-MM-dd"),
        allCommits: value,
        ownerCommits: ownerCommitsPartial[index],
        openIssues: openIssues.filter(({ created_at }: { created_at: string }) => {
          const lowest = subWeeks(now, index + 1)
          const highest = subWeeks(now, index)
          return isAfter(new Date(created_at), lowest) && isBefore(new Date(created_at), highest)
        }).length,
      }
    })
    res.status(200).json({ items })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
