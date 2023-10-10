import TextField from "@mui/material/TextField"
import { Box } from "@mui/system"
import Button from "@mui/material/Button"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { styled } from "@mui/material/styles"
import DateTime from "./DateTime"
import { Dayjs } from "dayjs"
import { useState } from "react"
import Switch from "@mui/material/Switch"
import { FormControlLabel, TextareaAutosize, useTheme } from "@mui/material"
import { ALLPOSTSBYUSER, CONNECTIONS, CREATEPOST } from "../queries"
import { Conn, Post, PostInput } from "../interfaces"
import uploadFile from "../util/uploadFile"
import useAlertFactory from "../Hooks/useAlertFactory"
import { useMutation, useQuery } from "@apollo/client"
import { Twitter, YouTube, Instagram, Send } from "@mui/icons-material"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

function checkSwitches(data: FormData, connected: string[]) {
  const checked: string[] = []
  connected.forEach((mediaName) => {
    if (data.get(mediaName) === "on") {
      checked.push(mediaName)
    }
  })
  return checked
}

function mediaListEntry(mediaName: string) {
  const IconArray: string[] = ["twitter", "youtube", "instagram"]
  function chooseIcon(mediaName: string) {
    if (!IconArray.includes(mediaName)) {
      return
    }
    if (mediaName === IconArray[0]) {
      return <Twitter />
    }
    if (mediaName === IconArray[1]) {
      return <YouTube />
    }
    if (mediaName === IconArray[2]) {
      return <Instagram />
    }
  }
  const label = (
    <div
      id="iconAndTitle"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {chooseIcon(mediaName)}
      <p>Twitter</p>
    </div>
  )
  return (
    <FormControlLabel control={<Switch name={mediaName} />} label={label} />
  )
}

//TODO: tokeni lähtee välillä ja ei toimi

export default function CreatePostPage() {
  const { refetch: refetchPosts } = useQuery<{ postsByFilter: Post[] }>(
    ALLPOSTSBYUSER
  )
  const navigate = useNavigate()
  const [value, setValue] = useState<Dayjs | null>(null)
  const [isScheduled, setIsScheduled] = useState<boolean>(false)
  const alert = useAlertFactory()
  const theme = useTheme()
  const { data, loading, error } = useQuery<{ connections: Conn[] }>(
    CONNECTIONS
  )
  const [createPost] = useMutation<{ post: Post }>(CREATEPOST)
  if (error) {
    alert.error(error.message, undefined, true)
  }
  if (loading) {
    console.log("loading")
    return <div>loading</div>
  }
  const connected: string[] = data?.connections.map((con) => con.name) || []

  const checkDate = () => {
    if (!isScheduled) {
      return dayjs().toDate()
    }
    if (value === null) {
      alert.error("Please select a date", undefined, true)
      return null
    }
    if (value.isBefore(Date.now())) {
      alert.error(
        "Please select a date in the future or not scheduled post",
        undefined,
        true
      )
      return null
    }
    return value.toDate()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    if (data.get("title") === "" || data.get("description") === "") {
      alert.error("title or content cant be empty", undefined, true)
      return
    }

    const file = data.get("file") as File

    const date = checkDate() as Date
    if (!date) {
      return
    }

    const id = await uploadFile(file, navigate)

    const sendPlatforms = checkSwitches(data, connected)
    const post: PostInput = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      dispatchTime: date,
      media: id,
      platforms: sendPlatforms,
    }

    if (id === "") {
      alert.info("no file uploaded", undefined, true)
      delete post.media
    }

    console.log(post)
    const response = await createPost({ variables: { post: post } })

    if (response) {
      refetchPosts()
      alert.success("Post created", undefined, true)
    }
  }
  return (
    <>
      <div
        id="createContainer"
        style={{
          width: "100%",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 1,
            margin: "10px",
          }}
        >
          <TextField
            margin="normal"
            id="title"
            label="title"
            name="title"
            autoComplete="Title"
            autoFocus
          />
          <TextareaAutosize
            title="description"
            aria-label="description"
            id="description"
            name="description"
            style={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "5px",
              outlineColor: theme.palette.text.primary,
              borderColor: theme.palette.text.disabled,
            }}
          />
          <FormControlLabel
            control={<Switch name="isScheduled" />}
            label="Create scheduled post"
            checked={isScheduled}
            onChange={() => setIsScheduled(!isScheduled)}
          />
          {isScheduled ? <DateTime value={value} onChange={setValue} /> : null}
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            <VisuallyHiddenInput
              type="file"
              accept=".txt,audio/*,video/*,image/*"
              name="file"
            />
            Upload File
          </Button>
          <ul
            style={{
              listStyle: "none",
            }}
          >
            {connected.map((mediaName) => {
              return <li key={mediaName}>{mediaListEntry(mediaName)}</li>
            })}
          </ul>
          <Button
            endIcon={<Send />}
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            send post
          </Button>
        </Box>
      </div>
    </>
  )
}
