import {
  Box,
  Card,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { Twitter, Delete, Add } from "@mui/icons-material"
import { connectPlatform } from "../util/api"
import { useMutation, useQuery } from "@apollo/client"
import { CONNECTIONS, DELETE_CONNECTION } from "../queries"
import useAlertFactory from "../Hooks/useAlertFactory"
import { Conn } from "../interfaces"
import { useEffect } from "react"

type Connection = {
  name: string
  icon: JSX.Element
}

const availableConnections = [
  {
    name: "twitter",
    icon: <Twitter />,
  },
  // {
  //   name: 'youtube',
  //   icon: <YouTube />,
  // },
  // {
  //   name: 'instagram',
  //   icon: <Instagram />,
  // },
]

function Media({
  connection,
  connected,
  onDelete,
}: {
  connection: Connection
  connected: boolean
  onDelete?: (name: string) => void
}) {
  const handleAdd = async () => {
    const url = await connectPlatform(connection.name)
    if (url) {
      window.location.href = url
    }
  }
  const onClick = connected ? () => onDelete?.(connection.name) : handleAdd
  const btnIcon = connected ? <Delete sx={{ color: "error.main" }} /> : <Add />

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 1,
        width: 200,
        backgroundColor: connected ? "background.default" : "text.disabled",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "left",
          flexGrow: 0,
          gap: 1,
          paddingLeft: 1,
        }}
      >
        {connection.icon}
        <Typography>{connection.name}</Typography>
      </Box>
      <IconButton onClick={onClick}>{btnIcon}</IconButton>
    </Card>
  )
}

export default function Connections() {
  const { data, loading, error, refetch } = useQuery<{ connections: Conn[] }>(
    CONNECTIONS
  )

  const [deleteCon, { data: dData, loading: dLoading, error: dErr }] =
    useMutation<{ ok: boolean; message: string }>(DELETE_CONNECTION)
  const alert = useAlertFactory()

  useEffect(() => {
    if (dLoading) {
      return
    }
    if (dErr) {
      alert.error(dErr.message, undefined, true)
      return
    }
    if (dData) {
      if (dData.ok) {
        alert.success(dData.message, undefined, true)
      } else {
        alert.error(dData.message, undefined, true)
      }
    }
  }, [dData, dLoading, dErr, alert])

  if (error) {
    alert.error(error.message, undefined, true)
  }

  const connected: string[] = data?.connections.map((con) => con.name) || []

  const handleDelete = (name: string) => {
    const variables = {
      name,
    }
    deleteCon({ variables })
    refetch()
  }
  const connectedMedias = connected.map((connection) => {
    const connectionData = availableConnections.find(
      (c) => c.name === connection
    )
    if (!connectionData) {
      return null
    }
    return (
      <Media
        connection={connectionData}
        key={connection}
        connected={true}
        onDelete={handleDelete}
      />
    )
  })

  const notConnectedMedias = availableConnections
    .filter((connection) => !connected.includes(connection.name))
    .map((connection) => (
      <Media connection={connection} key={connection.name} connected={false} />
    ))

  return (
    <Box>
      <Typography component="h3" variant="h6" gutterBottom>
        Connected medias
      </Typography>

      <Stack
        spacing={1}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading && <MediaSkeleton />}
        {!loading && connectedMedias}
        {!loading && notConnectedMedias}
      </Stack>
    </Box>
  )
}

function MediaSkeleton() {
  return <Skeleton variant="rounded" width={200} height={56} />
}
