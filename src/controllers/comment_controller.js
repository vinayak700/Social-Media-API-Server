import { ObjectId } from "mongodb";
import Comment from "../models/comment_schema.js";
import Post from "../models/post_schema.js";
import { ApplicationError } from "../../utils/error.js";

export default class CommentController {
  // Creating a new comment
  createComment = async (req, res, next) => {
    const userId = req.userId;
    const { postId } = req.params;
    try {
      // Create a new comment
      const newComment = new Comment({
        userId: userId,
        postId: postId,
        content: req.body.content,
      });
      await newComment.save();

      // Update the comment count in the post
      await Post.updateOne(
        { _id: new ObjectId(postId) },
        {
          $inc: { comments: 1 },
        }
      );

      // If the comment is created successfully, return a 201 response; otherwise, return a 400 response
      if (newComment) {
        return res
          .status(201)
          .json({ message: "Comment created successfully!" });
      }
      res.status(400).json({ error: "Failed to create the comment." });
    } catch (error) {
      console.log(error);
      // If an error occurs, throw a custom application error
      next(new ApplicationError(500, error.message));
    }
  };

  // Retrieving Comments of a specific post
  getPostComments = async (req, res, next) => {
    const { postId } = req.params;
    try {
      // Get comments for a specific post and populate the userId field
      const comments = await Comment.find({
        postId: new ObjectId(postId),
      }).populate({
        path: "userId",
        select: "-password -tokens -createdAt -updatedAt",
      });

      // If comments are found, return them; otherwise, return a 404 response
      if (comments.length > 0) {
        return res.status(200).json({ comments: comments });
      } else {
        return res
          .status(404)
          .json({ message: "No comments found on the post!" });
      }
    } catch (error) {
      console.log(error);
      // If an error occurs, throw a custom application error
      next(new ApplicationError(500, error.message));
    }
  };

  // Update a specific comment with a commentId
  updateComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.userId;
    try {
      // Find the comment by ID and user ID
      const comment = await Comment.findById(commentId);
      // Update the comment content
      const updatedComment = await Comment.updateOne(
        { _id: new ObjectId(commentId), userId: new ObjectId(userId) },
        { $set: { content: req.body.content || comment.content } }
      );

      // If the comment is updated successfully, return a 200 response; otherwise, return a 404 response
      if (updatedComment.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Comment updated successfully." });
      }
      res.status(404).json({ message: "No comment found." });
    } catch (error) {
      console.log(error);
      // If an error occurs, throw a custom application error
      next(new ApplicationError(500, error.message));
    }
  };

  // Delete a specific comment with a commentId
  deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.userId;
    try {
      // Find and delete the comment by ID and user ID
      const deletedComment = await Comment.findOneAndDelete({
        _id: new ObjectId(commentId),
        userId: new ObjectId(userId),
      });

      // If the comment is deleted, update the post comment count and return a 200 response; otherwise, return a 404 response
      if (deletedComment) {
        await Post.updateOne(
          { _id: deletedComment.postId },
          { $inc: { comments: -1 } }
        );
        return res.status(200).json({ message: "Comment deleted" });
      }
      res.status(400).json({ message: "No comment found." });
    } catch (error) {
      console.log(error);
      // If an error occurs, throw a custom application error
      next(new ApplicationError(500, error.message));
    }
  };
}
