export type RepositoryArgs = {
  avatarUrl: string
  description: string
  id: number
  name: string
}

export default class Repository {
  avatarUrl: string
  description: string
  id: number
  name: string

  constructor(args: RepositoryArgs) {
    this.avatarUrl = args.avatarUrl
    this.description = args.description
    this.id = args.id
    this.name = args.name
  }
}
