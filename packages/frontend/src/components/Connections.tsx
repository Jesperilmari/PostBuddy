import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import { Twitter, Delete, Add } from "@mui/icons-material";
import { connectPlatform } from "../util/api";
import { useQuery } from "@apollo/client";
import { CONNECTIONS } from "../queries";
import useAlertFactory from "../Hooks/useAlertFactory";
import { Conn } from "../interfaces";

type Connection = {
  name: string;
  icon: JSX.Element;
};

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
];

function Media({
  connection,
  connected,
}: {
  connection: Connection;
  connected: boolean;
}) {
  const handleDelete = () => {
    alert(`Delete ${connection.name}, not implemented yet`);
  };

  const handleAdd = async () => {
    const url = await connectPlatform(connection.name);
    if (url) {
      window.location.href = url;
    }
  };

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
      {connected ? (
        <IconButton onClick={handleDelete}>
          <Delete sx={{ color: "error.main" }} />
        </IconButton>
      ) : (
        <IconButton onClick={handleAdd}>
          <Add sx={{ color: "success.main" }} />
        </IconButton>
      )}
    </Card>
  );
}

export default function Connections() {
  const { data, loading, error } = useQuery<{ connections: Conn[] }>(
    CONNECTIONS
  );
  const alert = useAlertFactory();
  if (error) {
    alert.error(error.message, undefined, true);
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  const connected: string[] = data?.connections.map((con) => con.name) || [];

  const connectedMedias = connected.map((connection) => {
    const connectionData = availableConnections.find(
      (c) => c.name === connection
    );
    if (!connectionData) {
      return null;
    }
    return (
      <Media connection={connectionData} key={connection} connected={true} />
    );
  });

  const notConnectedMedias = availableConnections
    .filter((connection) => !connected.includes(connection.name))
    .map((connection) => (
      <Media connection={connection} key={connection.name} connected={false} />
    ));

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
        {connectedMedias}
        {notConnectedMedias}
      </Stack>
    </Box>
  );
}
