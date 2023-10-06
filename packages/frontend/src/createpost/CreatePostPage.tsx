import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import DateTime from "./DateTime";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";

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
});

export default function CreatePostPage() {
  const [value, setValue] = useState<Dayjs | null>(null);
  const medias = [2];
  const [file, setFile] = useState<File | null>(null);

  const fileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.item(0) ?? null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("twitter"));
    console.log(data.get("title"));
    console.log(data.get("PostContent"));
    console.log(data.get("file"));
    console.log(value?.format());
  };

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
            {medias.map(() => {
              return (
                <li>
                  <FormControlLabel
                    control={<Switch name="twitter" />}
                    label="Twitter"
                  />
                </li>
              );
            })}
          </ul>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
            send post
          </Button>
        </Box>
      </div>
    </>
  );
}
