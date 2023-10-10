import twitter from "./twitter"

export const platforms = {
  twitter,
} as const

export type PlatformName = keyof typeof platforms

export const implementedPlatforms = Object.keys(platforms) as PlatformName[]
