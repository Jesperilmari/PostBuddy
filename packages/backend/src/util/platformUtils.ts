import { Maybe } from "true-myth"
import { Platform } from "../api/interfaces/Platform"
import PlatformModel from "../api/models/PlatformModel"
import { PlatformName } from "../api/controllers/oauth/platforms"

type RefreshFun = {
  // eslint-disable-next-line
  (platform: Platform): Promise<Platform | null>
}

export async function findAndRefreshToken(
  platform: PlatformName,
  userId: string,
  refresh: RefreshFun,
): Promise<Maybe<Platform>> {
  const connection = await PlatformModel.findOne({
    name: platform,
    user: userId,
  })
  if (!connection) {
    return Maybe.nothing()
  }
  if (shouldRefresh(connection)) {
    const refreshed = await refresh(connection)
    return Maybe.of(refreshed)
  }
  return Maybe.just(connection)
}

export function shouldRefresh(platform: Platform) {
  const TWO_HOURS = 1000 * 60 * 60 * 2
  return Date.now() - platform.updatedAt.getTime() > TWO_HOURS
}
