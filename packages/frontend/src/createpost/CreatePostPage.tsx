import { Container, Typography, Paper } from "@mui/material"
import CreatePostForm from "./CreatePostForm.tsx"

export default function CreatePostPage() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Create post
      </Typography>
      <Paper
        sx={{
          width: "fit-content",
          p: 2,
        }}
      >
        <CreatePostForm />
      </Paper>
    </Container>
  )
}
