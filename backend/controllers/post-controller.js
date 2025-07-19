const User = require("../models/user-model");
const Post = require("../models/post-model");
const Comment = require("../models/comment-model");
const cloudinary = require("../config/cloudinary");
const formidable = require("formidable");
const mongoose = require("mongoose");


exports.addPost = async (req, res) => {

  try {

    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ msg: "Error in form parse !" });
      }


      //newPost
      const post = new Post();
      if (fields.text) {
        //post.text = text from postModel
        post.text = fields.text;
      }

      if (files.media) {

        //files.media.filePath = temp. location. , folder = foldr on cloudinary
        const uploadedImage = await cloudinary.uploader.upload(
          files.media.filepath,
          { folder: "Threads_clone_youtube/Posts" }
        );
        if (!uploadedImage) {
          return res.status(400).json({ msg: "Error while uploading Image !" });
        }

        //data will save media&public_id from postModel
        post.media = uploadedImage.secure_url;
        post.public_id = uploadedImage.public_id;
      }

      //admin from postModel
      post.admin = req.user._id;


      const newPost = await post.save();
      await User.findByIdAndUpdate(
        req.user._id,
        {
          //push the new postId in userModel
          $push: { threads: newPost._id },
        },
        { new: true }
      );


      res.status(201).json({ msg: "Post created !", newPost });


    });
  } catch (err) {
    res.status(400).json({ msg: "Error in addPost !", err: err.message });
  }
};


exports.allPost = async (req, res) => {

  try {

    // get page from req.query
    const { page } = req.query;
    let pageNumber = page;
    
    // if no page or page undefined than show page 1 {there will be no 0 page, so atleast show page1}
    if (!page || page === undefined) {
      pageNumber = 1;
    }


    // createdAt: -1 = The last post will show on first {Descending Order}
    // createdAt: 1 = The last post will show on first {Ascending Order}

    // skip((pageNumber - 1) * 3) = Skips old posts ,{if on pageno.1 , no post skips},
    // { if on pageno.2 ,skip previos 3 but show later 3 posts}, & so on >> {4,5,6},{7,8,9}

    //limit(3) = acc. to skip logic, 3
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * 3)
      .limit(3)
      .populate({ path: "admin", select: "-password" })//{-pw} removes pw otherwise will show pw
      .populate({ path: "likes", select: "-password" })//{-pw} removes pw otherwise will show pw
      .populate({
        path: "comments",
        populate: {
          path: "admin",
          model: "user",
        },
      });


    res.status(200).json({ msg: "Post Fetched !", posts });


  } catch (err) {
    res.status(400).json({ msg: "Error in allPost !", err: err.message });
  }
};


exports.deletePost = async (req, res) => {

  try {

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Id is required !" });
    }


    //check post exist by Id
    const postExists = await Post.findById(id);
    if (!postExists) {
      return res.status(400).json({ msg: "Post not found !" });
    }


    //post watcher
    const userId = req.user._id.toString(); //obj to str
    //post creator
    const adminId = postExists.admin._id.toString(); //obj to str

    //Verify the post creator{user or me(admin)} , we cant delete others post
    if (userId !== adminId) {
      return res
        .status(400)
        .json({ msg: "You are not authorized to delete this post !" });
    }


    //checks post contains media or not
    if (postExists.media) {
      await cloudinary.uploader.destroy(
        postExists.public_id,
        (error, result) => {
          console.log({ error, result });
        }
      );
    }

    //delete all comments
    await Comment.deleteMany({ _id: { $in: postExists.comments } });


    //select $or: [{ threads: id }, { reposts: id }, { replies: id }], then
    //delete $pull: { threads: id,reposts: id,replies: id,}
    await User.updateMany(
      {
        $or: [{ threads: id }, { reposts: id }, { replies: id }],
      },
      {
        $pull: {
          threads: id,
          reposts: id,
          replies: id,
        },
      },
      { new: true }
    );


    await Post.findByIdAndDelete(id);

    res.status(400).json({ msg: "Post deleted !" });

  } catch (err) {
    res.status(400).json({ msg: "Error in deletePost !", err: err.message });
  }
};


exports.likePost = async (req, res) => {

  try {

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Id is required !" });
    }


    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ msg: "No such Post !" });
    }


    //checks the userId in likes of postModel, if alrceady includes then remove userId & (unlike) 
    if (post.likes.includes(req.user._id)) {
      await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      return res.status(201).json({ msg: "Post unliked !" });
    }


    //checks the userId in likes of postModel, if not includes then add userId & like 
    await Post.findByIdAndUpdate(
      id,
      { $push: { likes: req.user._id } },
      { new: true }
    );

    return res.status(201).json({ msg: "Post liked !" });

  } catch (err) {
    res.status(400).json({ msg: "Error in likePost !", err: err.message });
  }
};


exports.repost = async (req, res) => {

  try {

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Id is needed !" });
    }


    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ msg: "No such post !" });
    }

    //Convert id from req.params into mongooseId
    const newId = new mongoose.Types.ObjectId(id);
    if (req.user.reposts.includes(newId)) {
      return res.status(400).json({ msg: "This post is already reposted !" });
    }

    // !req.user.reposts.includes(newId) then
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { reposts: post._id },
      },
      { new: true }
    );

    res.status(201).json({ msg: "Reposted !" });

  } catch (err) {
    res.status(400).json({ msg: "Error in repost !", err: err.message });
  }
};


exports.singlePost = async (req, res) => {

  //singlePost = show all info. of a post
  try {

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Id is required !" });
    }

    //find post then show below info by removing pw from them
    const post = await Post.findById(id)
      .populate({
        path: "admin",
        select: "-password",
      })
      .populate({ path: "likes", select: '-password' })
      .populate({
        path: "comments",
        populate: {
          path: "admin",
        },
      });

    res.status(200).json({ msg: "Post Fetched !", post });

  } catch (err) {
    res.status(400).json({ msg: "Error in singlePost !", err: err.message });
  }
};
