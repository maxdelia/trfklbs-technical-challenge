export async function getAsync(url: string): Promise<Error | any> {
  return fetch(url, {
    method: "GET",
  })
}
