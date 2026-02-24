import { LocalSession } from "@/helpers/auth/LocalSession";
import { UserSession } from "@/helpers/auth/UserSession";

export function getHeaders() {
  try {
    const accessToken = new UserSession(new LocalSession()).getSession();
    if (!accessToken) {
      throw new Error("AccessToken must be set");
    }
    return {
      "X-Emby-Token": accessToken
    }
  } catch (error) {
    throw Error(`There was an error trying to set Jellyfin headers\n${error}`)
  }
}