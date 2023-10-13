import {
  Backdrop,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import Button from "@mui/material/Button"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { styled } from "@mui/material/styles"
import DateTime from "./DateTime"
import { Dayjs } from "dayjs"
import { useState } from "react"
import Switch from "@mui/material/Switch"
import { FormControlLabel, useTheme } from "@mui/material"
import { CONNECTIONS, CREATEPOST } from "../queries"
import { Conn, Post, PostInput } from "../interfaces"
import uploadFile from "../util/uploadFile"
import useAlertFactory from "../Hooks/useAlertFactory"
import { useMutation, useQuery } from "@apollo/client"
import { Twitter, YouTube, Instagram, Send } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

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
      return (
        <Twitter
          sx={{
            color: "#26a7de",
          }}
        />
      )
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
        gap: "4px",
      }}
    >
      {chooseIcon(mediaName)}
      <Typography>Twitter</Typography>
    </div>
  )
  return (
    <FormControlLabel control={<Switch name={mediaName} />} label={label} />
  )
}

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [value, setValue] = useState<Dayjs | null>(null)
  const [isScheduled, setIsScheduled] = useState<boolean>(false)
  const [file, setFile] = useState<File | undefined | null>(undefined)
  const [showBackDrop, setShowBackDrop] = useState<boolean>(false)
  const [fileInputKey, setFileInputKey] = useState<string>(randomKey())
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

  const resetFileInput = () => {
    setFileInputKey(randomKey())
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    if (data.get("title") === "" || data.get("description") === "") {
      alert.error("title or content cant be empty", undefined, true)
      return
    }

    const date = checkDate() as Date
    if (!date) {
      return
    }
    const sendPlatforms = checkSwitches(data, connected)

    if (sendPlatforms.length === 0) {
      return alert.error("Please select at least one platform", undefined, true)
    }
    setShowBackDrop(true)
    const { id, message, err } = await uploadFile(navigate, file)

    if (file && err) {
      alert.error(err.message, undefined, true)
    }

    const post: PostInput = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      dispatchTime: date,
      media: id,
      platforms: sendPlatforms,
      mediaType: file?.type,
    }

    if (!id && message) {
      alert.error(message, undefined, true)
      delete post.media
      delete post.mediaType
    }

    const response = await createPost({ variables: { post: post } })

    setShowBackDrop(false)
    if (response) {
      alert.success("Post created", undefined, true)
    }
  }

  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: "2rem",
        }}
      >
        <Stack spacing={1}>
          <TextField
            margin="normal"
            id="title"
            label="title"
            name="title"
            autoComplete="Title"
            autoFocus
            style={{
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.text.disabled,
            }}
          />
          <TextField
            title="description"
            aria-label="description"
            id="description"
            name="description"
            label="description"
            multiline
            autoComplete="Description"
            style={{
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.text.disabled,
            }}
          />
          {isScheduled && <DateTime value={value} onChange={setValue} />}
          <FormControlLabel
            control={<Switch name="isScheduled" />}
            label="Send this post later?"
            checked={isScheduled}
            onChange={() => setIsScheduled(!isScheduled)}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography>Upload files</Typography>
          <Typography variant="caption">
            Max file size is 400mb. Png, jpg and mp4 files are supported.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Button
              endIcon={<CloudUploadIcon />}
              component="label"
              variant={file ? "outlined" : "contained"}
            >
              <VisuallyHiddenInput
                id="fileInput"
                type="file"
                accept=".txt,audio/*,video/*,image/*"
                name="file"
                onChange={(e) => {
                  setFile(e.target.files?.item(0))
                }}
                key={fileInputKey}
              />
              Add file
            </Button>
            {file && (
              <Chip
                id="filename"
                variant="filled"
                sx={{
                  color: theme.palette.text.secondary,
                }}
                label={file.name}
                onDelete={() => {
                  setFile(null)
                  resetFileInput()
                }}
              ></Chip>
            )}
          </Box>
        </Stack>

        <Box>
          <Typography gutterBottom>Send to</Typography>
          <Grid container>
            {connected.map((mediaName) => {
              return (
                <Grid key={mediaName} item>
                  {mediaListEntry(mediaName)}
                </Grid>
              )
            })}
          </Grid>
        </Box>
        <Button endIcon={<Send />} type="submit" variant="contained">
          send post
        </Button>
        <Backdrop
          sx={{
            color: theme.palette.primary.main,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={showBackDrop}
          onClick={() => setShowBackDrop(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </>
  )
}

function randomKey() {
  return Math.floor(Math.random() * 100000).toString()
}
