import QueryString from "query-string"

import Repository from "@/entities/Repository"
import StatsDatum from "@/entities/StatsDatum"
import { getAsync } from "@/helpers/network"

export class GenericQueryError extends Error {
  constructor(message?: string) {
    super(message || "There was an error processing your request. Please try again.")
  }
}

export type SearchResult = {
  items: Repository[]
  hasMore: boolean
}

export const searchAsync = async ({ query, page }: { query: string; page?: number }): Promise<SearchResult> => {
  const qsp: Record<string, any> = { query }
  if (page) qsp.page = page
  const url = `/api/search?${QueryString.stringify(qsp)}`
  try {
    const res = await getAsync(url)
    let resBody
    if (!res.ok) {
      try {
        resBody = await res.json()
        return Promise.reject(new GenericQueryError(resBody.message ? `Error: ${resBody.message}` : undefined))
      } catch (err: any) {
        return Promise.reject(new GenericQueryError())
      }
    }
    resBody = await res.json()
    return Promise.resolve(resBody)
  } catch (err: any) {
    return Promise.reject(new GenericQueryError(err.message))
  }
}

export type StatsResult = {
  items: StatsDatum[]
}

export const statsAsync = async ({ owner, repo }: { owner: string; repo: string }): Promise<StatsResult> => {
  const qsp: Record<string, any> = { owner, repo }
  const url = `/api/stats?${QueryString.stringify(qsp)}`
  try {
    const res = await getAsync(url)
    let resBody
    if (!res.ok) {
      try {
        resBody = await res.json()
        return Promise.reject(new GenericQueryError(resBody.message ? `Error: ${resBody.message}` : undefined))
      } catch (err: any) {
        return Promise.reject(new GenericQueryError())
      }
    }
    resBody = await res.json()
    return Promise.resolve(resBody)
  } catch (err: any) {
    return Promise.reject(new GenericQueryError(err.message))
  }
}
