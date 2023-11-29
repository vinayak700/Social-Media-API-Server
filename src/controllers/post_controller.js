// import { ObjectId } from "mongodb";
// import { ApplicationError } from "../../utils/error.js";
// import Post from "../models/post_schema.js";
// import Archive from "../models/post_archive_schema.js";

// export default class PostController {
//     // Create a new Post
//     createPost = async (req, res) => {
//         const userId = req.userId;
//         const { caption } = req.body;
//         const imageUrl = req.file ? req.file.filename : req.body.imageUrl;
//         const { save } = req.query;
//         let isDraft = save == "draft";
//         let newPost;
//         try {
//             if (isDraft) {
//                 newPost = new Post({
//                     userId: userId,
//                     caption: caption || "",
//                     imageUrl: imageUrl || "", // Handle the case when imageUrl is undefined
//                     isDraft: true,
//                 });
//             } else {
//                 newPost = new Post({
//                     userId: userId,
//                     caption: caption,
//                     imageUrl: imageUrl,
//                 });
//             }

//             await newPost.save();

//             if (newPost) {
//                 return res
//                     .status(201)
//                     .send(`Post has been created${isDraft ? " as a draft." : "."}`);
//             }

//             return res.status(400).send("Failed to create the post.");
//         } catch (error) {
//             console.log(error.message);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Retrieve a specific post with an Id
//     getPost = async (req, res) => {
//         const { postId } = req.params;
//         try {
//             const post = await Post.findById(postId);
//             if (post) {
//                 return res.status(200).send(post);
//             }
//             return res.status(400).send("No post found");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Retrieve all Posts of User
//     getUserPosts = async (req, res) => {
//         const userId = req.userId;
//         try {
//             // Return user populated posts
//             const posts = await Post.find({
//                 userId: new ObjectId(userId),
//                 isDraft: false,
//             }).populate({
//                 path: "userId",
//                 select: "-password -tokens -createdAt -updatedAt",
//             });
//             if (posts.length > 0) {
//                 return res.status(200).send(posts);
//             }
//             return res.status(400).send("No Posts found.");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Retrive all Posts from Users
//     getAllPosts = async (req, res) => {
//         try {
//             const posts = await Post.find({ isDraft: false }).populate({
//                 path: "userId",
//                 select: "-password -tokens -createdAt -updatedAt",
//             });
//             if (posts.length > 0) {
//                 return res.status(200).send(posts);
//             }
//             return res.status(400).send("No Posts found.");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Update a specific post with an Id
//     updatePost = async (req, res) => {
//         const { postId } = req.params;
//         const userId = req.userId;
//         const imageUrl = req.file ? req.file.filename : req.body.imageUrl;
//         try {
//             const post = await Post.findById(postId);
//             const updatedPost = await Post.updateOne(
//                 { _id: new ObjectId(postId), userId: new ObjectId(userId) },
//                 {
//                     $set: {
//                         caption: req.body.caption || post.caption,
//                         imageUrl: imageUrl || post.imageUrl,
//                     },
//                 }
//             );
//             if (updatedPost.modifiedCount > 0) {
//                 return res.status(200).send("Post has been updated!");
//             }
//             return res.status(400).send("Failed to update post");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Delete a specific post with an Id
//     deletePost = async (req, res) => {
//         const { postId } = req.params;
//         const userId = req.userId;
//         try {
//             const deletedPost = await Post.deleteOne({
//                 _id: new ObjectId(postId),
//                 userId: new ObjectId(userId),
//             });
//             if (deletedPost) {
//                 return res.status(200).send("Post has been deleted!");
//             }
//             return res.status(400).send("Failed to delete the post.");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Filter Posts with caption
//     filterPosts = async (req, res, next) => {
//         const { text } = req.query;
//         try {
//             let filterText = text.toLowerCase();
//             // Execute the query using the await keyword
//             const filteredPosts = await Post.find({
//                 $or: [
//                     { caption: { $regex: new RegExp(filterText, "i") } },
//                     {
//                         caption: {
//                             $regex: new RegExp(filterText.split(" ").join("|"), "i"),
//                         },
//                     },
//                 ],
//             });

//             if (filteredPosts.length > 0) {
//                 return res.status(200).json({ data: filteredPosts });
//             }
//             return res
//                 .status(404)
//                 .json({
//                     message: "No posts found matching the filter text in the caption.",
//                 });
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Toggle bookmark status on the specific post with an Id
//     toggleBookmark = async (req, res) => {
//         const { postId } = req.params;
//         const userId = req.userId;
//         try {
//             const post = await Post.findOne({
//                 _id: new ObjectId(postId),
//                 userId: new ObjectId(userId),
//             });
//             if (post) {
//                 post.bookMarked = !post.bookMarked;
//                 await post.save();
//                 return res.status(200).json({ message: "Bookmark status toggled." });
//             }
//             res.status(404).json({ message: "No post found." });
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Archive a specific post with an id
//     archivePost = async (req, res, next) => {
//         const { postId } = req.params;
//         const userId = req.userId;
//         try {
//             const post = await Post.findOne({
//                 _id: new ObjectId(postId),
//                 userId: new ObjectId(userId),
//             });
//             console.log(post);
//             if (post) {
//                 // Store the post details before deleting
//                 const archivedPostDetails = { ...post.toObject(), _id: undefined };
//                 await Post.deleteOne({
//                     _id: new ObjectId(postId),
//                     userId: new ObjectId(userId),
//                 }).select({ _id: 0 });

//                 const newArchive = new Archive(archivedPostDetails);
//                 await newArchive.save();
//                 if (newArchive) {
//                     return res.status(201).send("Post was archived.");
//                 }
//                 return res.status(400).send("Failed to archive the post.");
//             }
//             return res.status(404).send("Post was not found.");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };

//     // Unarchive a specific post with an id
//     unarchivePost = async (req, res, next) => {
//         const { postId } = req.params;
//         const userId = req.userId;
//         try {
//             const archive = await Archive.findOne({
//                 _id: new ObjectId(postId),
//                 userId: new ObjectId(userId),
//             });
//             if (archive) {
//                 const unarchivedPost = { ...archive.toObject(), _id: undefined };
//                 await Archive.deleteOne({
//                     _id: new ObjectId(postId),
//                     userId: new ObjectId(userId),
//                 });
//                 const newPost = new Post(unarchivedPost);
//                 await newPost.save();
//                 if (newPost) {
//                     return res.status(201).send("Post was unarchived.");
//                 }
//                 return res.status(400).send("Failed to unarchive the post.");
//             }
//             return res.status(404).send("Post was not found.");
//         } catch (error) {
//             console.log(error);
//             throw new ApplicationError(500, "Something went wrong");
//         }
//     };
// }

import { ObjectId } from "mongodb";
import { ApplicationError } from "../../utils/error.js";
import Post from "../models/post_schema.js";
import Archive from "../models/post_archive_schema.js";

export default class PostController {
    // Create a new Post
    createPost = async (req, res) => {
        const userId = req.userId;
        const { caption } = req.body;
        const imageUrl = req.file ? req.file.filename : req.body.imageUrl;
        const { save } = req.query;
        let isDraft = save == "draft";
        let newPost;
        try {
            // Create a new Post instance based on whether it is a draft or not
            if (isDraft) {
                newPost = new Post({
                    userId: userId,
                    caption: caption || "",
                    imageUrl: imageUrl || "",
                    isDraft: true,
                });
            } else {
                newPost = new Post({
                    userId: userId,
                    caption: caption,
                    imageUrl: imageUrl,
                });
            }

            // Save the new post to the database
            await newPost.save();

            // Check if the post is created successfully
            if (newPost) {
                return res
                    .status(201)
                    .json({
                        message: `Post has been created${isDraft ? " as a draft." : "."}`,
                    });
            }

            // If the post creation fails, send a 400 response
            return res.status(400).json({ error: "Failed to create the post." });
        } catch (error) {
            console.log(error.message);
            // If an error occurs during post creation, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Retrieve a specific post with an Id
    getPost = async (req, res) => {
        const { postId } = req.params;
        try {
            // Find a post by its ID
            const post = await Post.findById(postId);
            // Check if the post is found
            if (post) {
                return res.status(200).json(post);
            }
            // If the post is not found, send a 404 response
            return res.status(404).json({ error: "No post found." });
        } catch (error) {
            console.log(error);
            // If an error occurs during post retrieval, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Retrieve all Posts of User
    getUserPosts = async (req, res) => {
        const userId = req.userId;
        try {
            // Return user populated posts excluding drafts
            const posts = await Post.find({
                userId: new ObjectId(userId),
                isDraft: false,
            }).populate({
                path: "userId",
                select: "-password -tokens -createdAt -updatedAt",
            });
            // Check if any posts are found
            if (posts.length > 0) {
                return res.status(200).json(posts);
            }
            // If no posts are found, send a 400 response
            return res.status(400).json({ error: "No Posts found." });
        } catch (error) {
            console.log(error);
            // If an error occurs during post retrieval, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Retrieve all Posts from Users
    getAllPosts = async (req, res) => {
        try {
            // Return all posts excluding drafts
            const posts = await Post.find({ isDraft: false }).populate({
                path: "userId",
                select: "-password -tokens -createdAt -updatedAt",
            });
            // Check if any posts are found
            if (posts.length > 0) {
                return res.status(200).json(posts);
            }
            // If no posts are found, send a 400 response
            return res.status(400).json({ error: "No Posts found." });
        } catch (error) {
            console.log(error);
            // If an error occurs during post retrieval, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Update a specific post with an Id
    updatePost = async (req, res) => {
        const { postId } = req.params;
        const userId = req.userId;
        const imageUrl = req.file ? req.file.filename : req.body.imageUrl;
        try {
            // Find the post by ID
            const post = await Post.findById(postId);
            // Update the post with the provided data
            const updatedPost = await Post.updateOne(
                { _id: new ObjectId(postId), userId: new ObjectId(userId) },
                {
                    $set: {
                        caption: req.body.caption || post.caption,
                        imageUrl: imageUrl || post.imageUrl,
                    },
                }
            );
            // Check if the post is updated successfully
            if (updatedPost.modifiedCount > 0) {
                return res.status(200).json({ message: "Post has been updated!" });
            }
            // If the post update fails, send a 400 response
            return res.status(400).json({ error: "Failed to update post." });
        } catch (error) {
            console.log(error);
            // If an error occurs during post update, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Delete a specific post with an Id
    deletePost = async (req, res) => {
        const { postId } = req.params;
        const userId = req.userId;
        try {
            // Delete the post by ID and user ID
            const deletedPost = await Post.deleteOne({
                _id: new ObjectId(postId),
                userId: new ObjectId(userId),
            });
            // Check if the post is deleted successfully
            if (deletedPost) {
                return res.status(200).json({ message: "Post has been deleted!" });
            }
            // If the post deletion fails, send a 400 response
            return res.status(400).json({ error: "Failed to delete the post." });
        } catch (error) {
            console.log(error);
            // If an error occurs during post deletion, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Filter Posts with caption
    filterPosts = async (req, res, next) => {
        const { text } = req.query;
        try {
            // Execute the query to filter posts based on the provided text
            const filteredPosts = await Post.find({
                $or: [
                    { caption: { $regex: new RegExp(text, "i") } },
                    {
                        caption: {
                            $regex: new RegExp(text.split(" ").join("|"), "i"),
                        },
                    },
                ],
            });

            // Check if any filtered posts are found
            if (filteredPosts.length > 0) {
                return res.status(200).json({ data: filteredPosts });
            }
            // If no filtered posts are found, send a 404 response
            return res.status(404).json({
                message: "No posts found matching the filter text in the caption.",
            });
        } catch (error) {
            console.log(error);
            // If an error occurs during post filtering, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };
    // Toggle bookmark status on the specific post with an Id
    toggleBookmark = async (req, res) => {
        const { postId } = req.params;
        const userId = req.userId;
        try {
            // Find the post by ID and user ID
            const post = await Post.findOne({
                _id: new ObjectId(postId),
                userId: new ObjectId(userId),
            });
            // Check if the post is found
            if (post) {
                // Toggle the bookmark status
                post.bookMarked = !post.bookMarked;
                // Save the updated post
                await post.save();
                return res.status(200).json({ message: "Bookmark status toggled." });
            }
            // If the post is not found, send a 404 response
            res.status(404).json({ message: "No post found." });
        } catch (error) {
            console.log(error);
            // If an error occurs during toggling bookmark status, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Archive a specific post with an id
    archivePost = async (req, res, next) => {
        const { postId } = req.params;
        const userId = req.userId;
        try {
            // Find the post by ID and user ID
            const post = await Post.findOne({
                _id: new ObjectId(postId),
                userId: new ObjectId(userId),
            });
            console.log(post);
            // Check if the post is found
            if (post) {
                // Store the post details before deleting
                const archivedPostDetails = { ...post.toObject(), _id: undefined };
                // Delete the post
                await Post.deleteOne({
                    _id: new ObjectId(postId),
                    userId: new ObjectId(userId),
                }).select({ _id: 0 });

                // Create a new Archive instance with the stored details
                const newArchive = new Archive(archivedPostDetails);
                // Save the archived post
                await newArchive.save();
                // Check if the post is archived successfully
                if (newArchive) {
                    return res.status(201).json({ message: "Post was archived." });
                }
                // If archiving fails, send a 400 response
                return res.status(400).json({ error: "Failed to archive the post." });
            }
            // If the post is not found, send a 404 response
            return res.status(404).json({ error: "Post was not found." });
        } catch (error) {
            console.log(error);
            // If an error occurs during archiving, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };

    // Unarchive a specific post with an id
    unarchivePost = async (req, res, next) => {
        const { postId } = req.params;
        const userId = req.userId;
        try {
            // Find the archive by ID and user ID
            const archive = await Archive.findOne({
                _id: new ObjectId(postId),
                userId: new ObjectId(userId),
            });
            // Check if the archive is found
            if (archive) {
                // Store the unarchived post details before deleting the archive
                const unarchivedPost = { ...archive.toObject(), _id: undefined };
                // Delete the archive
                await Archive.deleteOne({
                    _id: new ObjectId(postId),
                    userId: new ObjectId(userId),
                });
                // Create a new Post instance with the unarchived details
                const newPost = new Post(unarchivedPost);
                // Save the unarchived post
                await newPost.save();
                // Check if the post is unarchived successfully
                if (newPost) {
                    return res.status(201).json({ message: "Post was unarchived." });
                }
                // If unarchiving fails, send a 400 response
                return res.status(400).json({ error: "Failed to unarchive the post." });
            }
            // If the archive is not found, send a 404 response
            return res.status(404).json({ error: "Post was not found." });
        } catch (error) {
            console.log(error);
            // If an error occurs during unarchiving, throw a custom application error
            throw new ApplicationError(500, "Something went wrong");
        }
    };
}
