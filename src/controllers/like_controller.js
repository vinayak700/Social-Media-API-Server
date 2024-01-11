import { ObjectId } from "mongodb";
import { ApplicationError } from "../../utils/error.js";
import Like from "../models/like_schema.js";
import Comment from "../models/comment_schema.js";
import Post from "../models/post_schema.js";

export default class LikeController {
  // Toggle Like status
  toggleLike = async (req, res, next) => {
    const { type } = req.query;
    const { id } = req.params;
    const userId = req.userId;
    try {
      // Toggle like based on the type (post or comment)
      if (type === "post") {
        const like = await Like.findOne({ postId: new ObjectId(id) });

        // If like exists, delete it and decrement Post likes count
        if (like) {
          await Like.deleteOne({ _id: new ObjectId(like._id) });
          await Post.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { likes: -1 } }
          );
        } else {
          // If like doesn't exist, create a new like and increment Post likes count
          const newPostLike = new Like({
            userId: new ObjectId(userId),
            postId: new ObjectId(id),
          });
          await newPostLike.save();
          await Post.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { likes: 1 } }
          );
        }
        return res.status(200).json({ message: "Post like toggled" });
      }

      if (type === "comment") {
        const like = await Comment.findOne({ commentId: new ObjectId(id) });

        // If like exists, delete it
        if (like) {
          await Like.deleteOne({ _id: new ObjectId(like._id) });
        } else {
          // If like doesn't exist, create a new like
          const newCommentLike = new Comment({
            userId: new ObjectId(userId),
            commentId: new ObjectId(id),
          });
          await newCommentLike.save();
        }
        return res.status(200).json({ message: "Comment like toggled" });
      }

      // If type is neither post nor comment, return a 404 response
      return res.status(404).json({ message: "No like found!" });
    } catch (error) {
      console.log(error);
      // If an error occurs, throw a custom application error
      next(new ApplicationError(500, error.message));
    }
  };

  // Retrieving likes based on the type model
  getLikes = async (req, res, next) => {
    const { type } = req.query;
    const { id } = req.params;
    try {
      // Get likes based on the type (post or comment)
      if (type === "post") {
        const likes = await Like.find({ postId: new ObjectId(id) }).populate({
          path: "userId",
          select: "-password -tokens -createdAt -updatedAt",
        });

        // If likes are found, return them; otherwise, return a 404 response
        if (likes.length > 0) {
          return res.status(200).send({ Likes: likes });
        }
        return res.status(404).json({ message: "No likes found!" });
      }

      if (type === "comment") {
        const likes = await Like.find({ commentId: new ObjectId(id) }).populate(
          "userId"
        );

        // If likes are found, return them; otherwise, return a 404 response
        if (likes > 0) {
          return res.status(200).send({ Likes: likes });
        }
        return res.status(404).json({ message: "No likes found!" });
      }
    } catch (error) {
      console.log(error);
      // If an error occurs, throw a custom application error
      next(new ApplicationError(500, error.message));
    }
  };
}
