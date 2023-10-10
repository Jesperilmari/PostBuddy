import { Container, Typography, Paper } from "@mui/material"
import CreatePostForm from "./CreatePostForm.tsx"

export default function CreatePostPage() {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Create post
      </Typography>
      <Paper>
        <CreatePostForm />
      </Paper>
    </Container>
  )
}
