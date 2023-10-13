import { Post } from "../interfaces"
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
  useTheme,
} from "@mui/material"
import {
  Delete,
  Twitter,
  QuestionMark,
  Instagram,
  ArrowUpward,
  CheckCircle,
  HourglassTop,
} from "@mui/icons-material"
import { useEffect, useState } from "react"
import { DELETE_POST } from "../queries"
import { useMutation } from "@apollo/client"
import useAlertFactory from "../Hooks/useAlertFactory"

type TableProps = {
  posts: Post[]
  refetch: () => void
}

export default function SimplePostTable({ posts, refetch }: TableProps) {
  const [sortAsc, setSortAsc] = useState<boolean>(true)
  const alert = useAlertFactory()
  const [deletePost, { data, loading, error }] = useMutation<{
    deletePost: { message: string }
  }>(DELETE_POST)

  const onDelete = (post: Post) => {
    const variables = {
      deletePostId: [post.id],
    }
    deletePost({
      variables,
    })
  }
  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      alert.error(error.message, undefined, true)
    }
    if (data) {
      alert.success(data.deletePost.message, undefined, true)
      refetch()
    }
  }, [loading, error, data, alert, refetch])

  const sortedPosts = [...posts].sort(sortAsc ? sortByDateAsc : sortByDateDesc)

  const cols: TableCol[] = [
    {
      name: "Title",
    },
    {
      name: "Platforms",
    },
    {
      name: "Status",
    },
    {
      name: "Release time",
      btn: <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />,
    },
    {
      name: "Actions",
    },
  ]

  return (
    <TableContainer component={Paper} elevation={8}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <PostTableHead cols={cols} />
        <TableBody>
          {sortedPosts.map((post) => (
            <PostTableRow key={post.id} post={post} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function sortByDateAsc(post: Post, post2: Post) {
  const date = new Date(post.dispatchTime)
  const date2 = new Date(post2.dispatchTime)
  return date.getTime() - date2.getTime()
}

function sortByDateDesc(post: Post, post2: Post) {
  const date = new Date(post.dispatchTime)
  const date2 = new Date(post2.dispatchTime)
  return date2.getTime() - date.getTime()
}

export type TableCol = {
  name: string
  btn?: React.ReactNode
}

type SortButtonProps = {
  sortAsc: boolean
  setSortAsc: (sortAsc: boolean) => void
}

function SortButton({ sortAsc, setSortAsc }: SortButtonProps) {
  const theme = useTheme()
  return (
    <IconButton
      aria-label="sort"
      onClick={() => setSortAsc(!sortAsc)}
      sx={{
        transform: sortAsc ? "rotate(0deg)" : "rotate(180deg)",
        transition: "transform ease 0.2s",
      }}
    >
      <ArrowUpward
        sx={{
          color: theme.palette.text.secondary,
        }}
      />
    </IconButton>
  )
}

export function PostTableHead({ cols }: { cols: TableCol[] }) {
  const theme = useTheme()
  return (
    <TableHead
      sx={{
        ".MuiTableCell-root": {
          borderBottomColor: theme.palette.secondary.main,
        },
      }}
    >
      <TableRow>
        {cols.map((col) => (
          <TableCell key={col.name}>
            {col.name}
            {col.btn && col.btn}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

type PostTableRowProps = {
  post: Post
  onDelete: (post: Post) => void
}

function PostTableRow({ post, onDelete }: PostTableRowProps) {
  const platFormIcons = platformsToIcons(post.platforms)
  const theme = useTheme()
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        ".MuiTableCell-root": {
          borderBottomColor: theme.palette.secondary.main,
        },
      }}
    >
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
        {hasBeenPosted(post) ? <Sent /> : <Waiting />}
      </TableCell>
      <TableCell align="left">
        {new Date(post.dispatchTime).toLocaleString()}
      </TableCell>
      <TableCell align="left">
        <IconButton aria-label="delete" onClick={() => onDelete(post)}>
          <Delete
            sx={{
              color: theme.palette.text.secondary,
            }}
          />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

function Sent() {
  const theme = useTheme()
  return (
    <CheckCircle
      sx={{
        color: theme.palette.text.secondary,
      }}
    />
  )
}

function Waiting() {
  const theme = useTheme()
  const [rotation, setRotation] = useState<number>(0)
  useEffect(() => {
    if (rotation == 0) {
      return setRotation(180)
    }
    const timeout = setTimeout(() => {
      setRotation((rotation) => rotation + 180)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [rotation, setRotation])
  return (
    <HourglassTop
      sx={{
        color: theme.palette.text.secondary,
        transform: `rotate(${rotation}deg)`,
        transition: "transform ease-in-out 0.5s",
      }}
    />
  )
}

function platformsToIcons(platforms: string[]) {
  const icons: Record<string, React.ReactNode> = {
    twitter: <Twitter key="twitter" sx={{ color: "#26a7de" }} />,
    instagram: <Instagram key="instagram" />,
  }
  return platforms.map((platform) => icons[platform] || <QuestionMark />)
}

function hasBeenPosted(post: Post) {
  const date = new Date(post.dispatchTime)
  return date.getTime() <= Date.now()
}
