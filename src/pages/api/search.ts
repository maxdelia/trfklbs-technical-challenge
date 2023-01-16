import type { NextApiRequest, NextApiResponse } from "next"
import { Octokit } from "octokit"

import Repository from "@/entities/Repository"
import { fromApi } from "@/adapters/repositoryAdapter"

export type SearchError = {
  message: string
  parameter?: string
}

export type SearchResponse = {
  items: Repository[]
  hasMore: boolean
}

const isInteger = (numberStr: string) => /^-?[0-9]+$/.test(numberStr.trim() + "")

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchError | SearchResponse>) {
  try {
    const { page, query } = req.query
    if (page && (typeof page !== "string" || !isInteger(page))) {
      res.status(400).json({ message: "Invalid query parameter", parameter: "page" })
      return
    }
    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Invalid query parameter", parameter: "query" })
      return
    }
    const defPage = page ? +page : 1
    const octokit = new Octokit()
    const {
      data: { items, total_count },
    } = await octokit.rest.search.repos({
      q: query,
      sort: "stars",
      per_page: 3,
      page: defPage,
    })
    res.status(200).json({ items: items.map(fromApi), hasMore: total_count > defPage * 3 })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
