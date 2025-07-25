const User = require("../models/user-model");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const mongoose = require("mongoose");


exports.addComment = async (req, res) => {

  try {

    const { id } = req.params;
    const { text } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "id is required !" });
    }
    if (!text) {
      return res.status(400).json({ msg: "No comment is added !" });
    }


    const postExists = await Post.findById(id);
    if (!postExists) {
      return res.status(400).json({ msg: "No such post !" });
    }


    //Comment = commentModel
    const comment = new Comment({
      text,
      admin: req.user._id,
      post: postExists._id,
    });

    //save the comment in new variable newComment
    const newComment = await comment.save();
  
    //add comment in the postModel's comments
    await Post.findByIdAndUpdate(
      id,
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    //add comment in the userModel's replies
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { replies: newComment._id },
      },
      { new: true }
    );

    res.status(201).json({ msg: "Commented !" });

  } catch (err) {
    res.status(400).json({ msg: "Error in addComment !", err: err.message });
  }
};


exports.deleteComment = async (req, res) => {

  try {

    const { postId, id } = req.params;
    if (!postId || !id) {
      return res.status(400).json({ msg: "Error in deleteComment !" });
    }


    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(400).json({ msg: "No such post !" });
    }


    const commentExists = await Comment.findById(id);
    if (!commentExists) {
      return res.status(400).json({ msg: "No such comment !" });
    }

    //if post & comment both exists then......
    
    //Convert commentid into mongooseID
    const newId = new mongoose.Types.ObjectId(id);


    // comments.includes(newId) in postModel
    if (postExists.comments.includes(newId)) {
      const id1 = commentExists.admin._id.toString(); //commentCreator
      const id2 = req.user._id.toString(); //otherUser

      if (id1 !== id2) {
        return res
          .status(400)
          .json({ msg: "You are not authorized to delete the comment !" });
      }

      //if authorized then ...delete the comentId from comments of CommentModel
      await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { comments: id },
        },
        { new: true }
      );

      //if authorized then ...delete the comentId from replies of UserModel
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { replies: id },
        },
        { new: true }
      );

      //delete comment from commentModel
      await Comment.findByIdAndDelete(id);
      return res.status(201).json({ msg: "Comment deleted !" });

    }
    res.status(201).json({ msg: "This post does not include the comment !" });

  } catch (err) {
    res.status(400).json({ msg: "Error in deleteComment", err: err.message });
  }
};
