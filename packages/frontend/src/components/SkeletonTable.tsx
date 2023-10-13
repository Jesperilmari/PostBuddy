import { Stack } from "@mui/material"
import PostTableRowSkeleton from "./PostTableRowSkeleton"

export default function SkeletonTable() {
  return (
    <Stack spacing={0}>
      <PostTableRowSkeleton />
      <PostTableRowSkeleton />
      <PostTableRowSkeleton />
      <PostTableRowSkeleton />
      <PostTableRowSkeleton />
    </Stack>
  )
}
