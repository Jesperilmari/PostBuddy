import TextField from '@mui/material/TextField'
import { Box } from '@mui/system'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import DateTime from './DateTime'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import Switch from '@mui/material/Switch'
import { FormControlLabel } from '@mui/material'
import { CONNECTIONS, CREATEPOST } from '../queries'
import { Conn, Post, PostInput } from '../interfaces'
import uploadFile from '../util/uploadFile'
import useAlertFactory from '../Hooks/useAlertFactory'
import { useMutation, useQuery } from '@apollo/client'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

function checkSwitches(data: FormData, connected: string[]) {
  const checked: string[] = []
  connected.forEach((mediaName) => {
    if (data.get(mediaName) === 'on') {
      checked.push(mediaName)
    }
  })
  return checked
}

//TODO: tokeni lähtee välillä ja ei toimi

export default function CreatePostPage() {
  const [value, setValue] = useState<Dayjs | null>(null)
  const [id, setId] = useState<string>('')
  const alert = useAlertFactory()
  const { data, loading, error } = useQuery<{ connections: Conn[] }>(CONNECTIONS)
  const [createPost] = useMutation<{ post: Post }>(CREATEPOST)
  if (error) {
    alert.error(error.message, undefined, true)
  }
  if (loading) {
    console.log('loading')
    return <div>loading</div>
  }
  const connected: string[] = data?.connections.map((con) => con.name) || []

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    console.log(data.get('title'))
    console.log(data.get('PostContent'))
    if (data.get('title') === '' || data.get('PostContent') === '') {
      alert.error('title or content cant be empty', undefined, true)
      return
    }
    console.log(value?.format())
    console.log(connected)

    if (value === null) {
      alert.error('Please select a date', undefined, true)
      return
    }
    if (value.isBefore(Date.now())) {
      alert.error('Please select a date in the future', undefined, true)
      return
    }

    const file = data.get('file') as File

    if (!(file.name === '')) {
      console.log(file)
      setId(await uploadFile(file))
      if (id === '') {
        alert.error('Error uploading file', undefined, true)
        return
      }
      alert.success('File uploaded', undefined, true)
    }

    const sendPlatforms = checkSwitches(data, connected)
    const post: PostInput = {
      title: data.get('title') as string,
      description: data.get('PostContent') as string,
      dispatchTime: value.toDate(),
      media: id,
      platforms: sendPlatforms,
    }

    const response = await createPost({ variables: { post: post } })
    console.log(response)
    if (response) {
      alert.success('Post created', undefined, true)
    }
  }
  return (
    <>
      <div
        id="createContainer"
        style={{
          width: '100%',
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 1,
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
          <TextField
            margin="normal"
            name="PostContent"
            label="description"
            type="description"
            id="description"
            autoComplete="description"
          />
          <DateTime value={value} onChange={setValue} />
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            <VisuallyHiddenInput type="file" accept=".txt,audio/*,video/*,image/*" name="file" />
            Upload File
          </Button>
          <ul
            style={{
              listStyle: 'none',
            }}
          >
            {connected.map((mediaName) => {
              return (
                <li>
                  <FormControlLabel control={<Switch name={mediaName} />} label={mediaName} />
                </li>
              )
            })}
          </ul>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            send post
          </Button>
        </Box>
      </div>
    </>
  )
}
