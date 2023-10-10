import { useQuery } from "@apollo/client"
import useAlertFactory from "../Hooks/useAlertFactory"
import { Post } from "../interfaces"
import { ALLPOSTSBYUSER } from "../queries"
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { Delete, Twitter, QuestionMark, Instagram } from "@mui/icons-material"

const onePost: Post = {
  description: "This is a description",
  dispatchTime: new Date().toString(),
  id: "1",
  platforms: ["twitter", "instagram"],
  media: "adsfsdf",
  postOwner: "1",
  title: "This is a title",
}

export default function SimplePostTable() {
  const { data, loading, error } = useQuery<{ postsByFilter: Post[] }>(
    ALLPOSTSBYUSER
  )
  const alert = useAlertFactory()

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    alert.error(error.message)
  }
  console.log(data)

  const posts = data?.postsByFilter || [onePost]

  if (posts.length === 0) {
    return <p>No posts found</p>
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <PostTableHead />
        <TableBody>
          {posts.map((post) => (
            <PostTableRow key={post.dispatchTime} post={post} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const cols = ["Title", "Platforms", "Status", "Release time", "Actions"]

function PostTableHead() {
  return (
    <TableHead>
      <TableRow>
        {cols.map((col) => (
          <TableCell key={col}>{col}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

function PostTableRow({ post }: { post: Post }) {
  const platFormIcons = platformsToIcons(post.platforms)
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {post.title}
      </TableCell>
      <TableCell align="left">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
          }}
        >
          {platFormIcons}
        </Box>
      </TableCell>
      <TableCell align="left">
        {hasBeenPosted(post) ? "sent" : "waiting"}
      </TableCell>
      <TableCell align="left">{post.dispatchTime}</TableCell>
      <TableCell align="left">
        <IconButton aria-label="delete">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

function platformsToIcons(platforms: string[]) {
  const icons: Record<string, React.ReactNode> = {
    twitter: <Twitter key="twitter" />,
    instagram: <Instagram key="instagram" />,
  }
  return platforms.map((platform) => icons[platform] || <QuestionMark />)
}

function hasBeenPosted(post: Post) {
  const date = new Date(post.dispatchTime)
  return date.getTime() <= Date.now()
}
