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

type TableProps = {
  posts: Post[]
}

export default function SimplePostTable({ posts }: TableProps) {
  const [sortAsc, setSortAsc] = useState<boolean>(true)

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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <PostTableHead cols={cols} />
        <TableBody>
          {sortedPosts.map((post) => (
            <PostTableRow key={post.id} post={post} />
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

type TableCol = {
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

function PostTableHead({ cols }: { cols: TableCol[] }) {
  return (
    <TableHead>
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

function PostTableRow({ post }: { post: Post }) {
  const platFormIcons = platformsToIcons(post.platforms)
  const theme = useTheme()
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
        {hasBeenPosted(post) ? <Sent /> : <Waiting />}
      </TableCell>
      <TableCell align="left">
        {new Date(post.dispatchTime).toLocaleString()}
      </TableCell>
      <TableCell align="left">
        <IconButton aria-label="delete">
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
