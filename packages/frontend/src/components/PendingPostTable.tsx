import { useQuery } from "@apollo/client"
import SimplePostTable from "./SimplePostTable"
import { Post } from "../interfaces"
import useAlertFactory from "../Hooks/useAlertFactory"
import { ALLPOSTSBYUSER } from "../queries"

export default function PendingPostTable() {
  const { data, loading, error } = useQuery<{ postsByFilter: Post[] }>(
    ALLPOSTSBYUSER,
    {
      // Always fetch because might have been updated
      // there is a better solution but this works for now
      fetchPolicy: "network-only",
    }
  )

  const alert = useAlertFactory()

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    alert.error(error.message)
  }

  const posts = data?.postsByFilter || []

  const sentPosts = posts.filter(hasNotBeenPosted)

  if (posts.length === 0) {
    return <p>No posts found</p>
  }

  return <SimplePostTable posts={sentPosts} />
}

function hasNotBeenPosted(post: Post) {
  const date = new Date(post.dispatchTime)
  return date.getTime() >= Date.now()
}
