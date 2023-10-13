import { Card, Divider, Skeleton } from "@mui/material"

export default function PostTableRowSkeleton() {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "73px",
        alignItems: "center",
        gap: "8rem",
        pl: 2,
        borderRadius: "2px",
        justifyContent: "space-between",
      }}
      variant="outlined"
    >
      <Skeleton variant="rounded" width="40px" height="10px" />
      <Skeleton variant="circular" width={20} height={20} />
      <Skeleton variant="circular" width={20} height={20} />
      <Skeleton variant="rounded" width="80px" height="10px" />
      <Skeleton variant="rounded" width="20px" height="20px" />
      <Divider />
    </Card>
  )
}
