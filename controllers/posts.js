import Post from '../models/Post.js'
import User from '../models/User.js'

/** CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body
        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            likes: {},
            comments: [],
        })

        await newPost.save();

        // This will return All post in DB along with the new Post added so that can be sent back to client
        const post = await Post.find();
        res.status(201).json(post)

    } catch (error) {
        res.status(409).json({ msg: console.log(error.message) })
    }
}

/** READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(201).json(post)
    } catch (err) {
        res.status(404).json({ msg: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params

        const post = await Post.find({ userId });
        res.status(201).json(post)
    } catch (err) {
        res.status(404).json({ msg: err.message })
    }
}

/** UPDATE */
export const likePost = async (req, res) => {
    try {

        const { id } = req.params
        const { userId } = req.body

        // getting the particular post
        const post = await Post.findById(id)

        // checking if the user has liked that post or not 
        const isLiked = post.likes.get(userId)

        // if liked then remove or not then add like 
        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        )

        res.status(200).json(updatedPost)
    } catch (err) {
        res.status(404).json({ msg: err.message })
    }
} 