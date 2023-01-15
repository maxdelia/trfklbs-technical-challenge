import QueryString from "query-string"

import Repository from "@/entities/Repository"
import { getAsync } from "@/helpers/network"

export class GenericQueryError extends Error {
  constructor() {
    super("There was an error processing your request. Please try again.")
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
    if (!res.ok) {
      return Promise.reject(new GenericQueryError())
    }
    const { items, has_more: hasMore } = await res.json()
    return Promise.resolve({ items, hasMore })
  } catch (err) {
    return Promise.reject(new GenericQueryError())
  }
}
