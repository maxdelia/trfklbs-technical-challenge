export default interface RepositoryStats {
  name: string
  description: string
  fromDate: string
  toDate: string
  collaborators: { [key: string]: number }[]
  openIssues: { [key: string]: number }[]
  stars: { [key: string]: number }[]
}
