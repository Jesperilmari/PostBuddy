import HomePage from "./Home/Homepage";
import Settings from "./components/Settings";
import { Edit, Home, Settings as SettingsIcon } from "@mui/icons-material";
import CreatePostPage from "./createpost/CreatePostPage";

export type Page = {
  name: string;
  icon: React.ReactNode;
  elem: React.ReactNode;
};

export const pages = [
  {
    name: "HomePage",
    icon: <Home />,
    elem: <HomePage />,
  },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    elem: <Settings />,
  },
  {
    name: "CreatePost",
    icon: <Edit />,
    elem: <CreatePostPage />,
  },
] as const;

export type PageName = (typeof pages)[number]["name"];
