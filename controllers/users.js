import User from "../models/User.js"

export const getUser = async (req, res) => {
    try {
        // taking from url
        const { id } = req.params;
        const user = await User.findById(id)

        if (!user) return res.status(404).json({ msg: "User not found" })
        res.status(200).json(user)
    } catch (err) {
        return res.status(404).json({ error: err.message })
    }
}
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, pitcturePath }) => {
                return { _id, firstName, lastName, occupation, location, pitcturePath }
            }
        );

        res.status(200).json(formattedFriends)
    } catch (err) {
        return res.status(404).json({ error: err.message })
    }
}
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        console.log("FriendID : " + friendId);
        const user = await User.findById(id)
        const friend = await User.findById(friendId)
        console.log(friend);

        if (user.friends.includes(friendId)) {
            console.log("Hello");
            user.friends = user.friends.filter((id) => id !== friendId)
            friend.friends = friend.friends.filter((id) => id !== id) // could get problem
        } else {
            user.friends.push(friendId)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, pitcturePath }) => {
                return { _id, firstName, lastName, occupation, location, pitcturePath }
            }
        );

        res.status(200).json(formattedFriends)

    } catch (err) {
        return res.status(404).json({ error: console.log(err.message) })
    }
} 