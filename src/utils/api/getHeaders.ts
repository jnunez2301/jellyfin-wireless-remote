import { LocalSession } from "@/models/LocalSession";
import { UserSession } from "@/models/UserSession";

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