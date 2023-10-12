import { useQuery } from "@apollo/client"
import SimplePostTable from "./SimplePostTable"
import { Post } from "../interfaces"
import useAlertFactory from "../Hooks/useAlertFactory"
import { ALLPOSTSBYUSER } from "../queries"

export default function SentPostTable() {
  const { data, loading, error, refetch } = useQuery<{ postsByFilter: Post[] }>(
    ALLPOSTSBYUSER
  )
  const alert = useAlertFactory()

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    alert.error(error.message)
  }

  const posts = data?.postsByFilter || []

  const sentPosts = posts.filter(hasBeenPosted)

  if (posts.length === 0) {
    refetch()
    return <p>No posts found</p>
  }

  return <SimplePostTable posts={sentPosts} />
}

function hasBeenPosted(post: Post) {
  const date = new Date(post.dispatchTime)
  return date.getTime() <= Date.now()
}
