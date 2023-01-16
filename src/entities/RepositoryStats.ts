export default interface RepositoryStats {
  fromDate: string
  toDate: string
  collaborators: { [key: string]: number }[]
  openIssues: { [key: string]: number }[]
  stars: { [key: string]: number }[]
}
