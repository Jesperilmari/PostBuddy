import { User } from "../../src/api/interfaces/User"
import PostsModel from "../../src/api/models/PostsModel"

namespace PostTestUtils {
  export async function createPost(
    user: User,
    title: string = "title",
    description: string = "desc",
    platforms: string[] = ["twitter"],
    dispatchTime: Date = new Date(Date.now() + 100000),
    media?: string,
    mediaType?: string,
  ) {
    return PostsModel.create({
      title,
      description,
      platforms,
      dispatchTime,
      postOwner: user._id,
      media,
      mediaType,
    })
  }
}

export default PostTestUtils
