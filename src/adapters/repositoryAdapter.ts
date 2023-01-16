export const fromApi = (apiObj: any) => ({
  avatarUrl: apiObj.owner.avatar_url,
  description: apiObj.description,
  id: apiObj.id,
  name: apiObj.full_name,
})
