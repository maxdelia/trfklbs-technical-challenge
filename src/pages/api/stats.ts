import type { NextApiRequest, NextApiResponse } from "next"
import { format, subWeeks } from "date-fns"

import { getAsync } from "@/helpers/network"
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
    const collaboratorsRes = await getAsync(`https://api.github.com/repos/${owner}/${repo}/stats/participation`)
    const collaboratorsResBody = await collaboratorsRes.json()
    if (!collaboratorsRes.ok) {
      res.status(collaboratorsRes.status).json({ message: collaboratorsRes.message })
    }
    const now = new Date()
    const items: StatsDatum[] = collaboratorsResBody.all
      .slice(0, 8)
      .map((value: number, index: number) => ({
        date: format(subWeeks(now, index), "yyyy-MM-dd"),
        collaborators: value,
        openIssues: 0,
      }))
      .reverse()
    res.status(200).json({ items })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
