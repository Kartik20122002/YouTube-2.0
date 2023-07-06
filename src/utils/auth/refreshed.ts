import { clientId, clientSecret } from "../secrets/secrets"

export const refreshedToken = async (refreshToken : any)=>{

    const url =
    "https://oauth2.googleapis.com/token?" +
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken as string,
    } as any)

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })

  const refreshedTokens = await response.json()

  return refreshedTokens;

  if (!response.ok) {
    throw refreshedTokens
  }
}

