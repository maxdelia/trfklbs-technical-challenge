import QueryString from "query-string"
import type { NextApiRequest, NextApiResponse } from "next"

import Repository from "@/entities/Repository"
import { getAsync } from "@/helpers/network"
import { gitHubApiRoot } from "@/config"

export type SearchError = {
  message: string
  parameter?: string
}

export type SearchResponse = {
  items: Repository[]
  has_more: boolean
}

const isInteger = (numberStr: string) => /^-?[0-9]+$/.test(numberStr.trim() + "")

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchError | SearchResponse>) {
  const { page, query } = req.query
  try {
    if (page && (typeof page !== "string" || !isInteger(page))) {
      res.status(400).json({ message: "Invalid query parameter", parameter: "page" })
      return
    }
    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Invalid query parameter", parameter: "query" })
      return
    }
    const defPage = page ? +page : 1
    const qsp: Record<string, any> = {
      q: query,
      sort: "stars",
      per_page: 3,
      page: defPage,
    }
    const url = `${gitHubApiRoot}/search/repositories?${QueryString.stringify(qsp)}`
    const extRes = await getAsync(url)
    const resBody = await extRes.json()
    if (!extRes.ok) {
      res.status(extRes.status).json(resBody)
      return
    }
    const items: Repository[] = resBody.items.map((item: any) => ({
      avatarUrl: item.owner.avatar_url,
      description: item.description,
      id: item.id,
      name: item.full_name,
    }))
    res.status(200).json({ items, has_more: resBody.total_count > defPage * 3 })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
