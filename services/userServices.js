import { User } from "../models/user.js";


export const createUser = async(userData) => {
    try {
        const user = await User.create(userData);
        return await user.save();
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
};

// export const updateUser = async (id, updateData) => {
//     try {

//         return await User.findByIdAndUpdate(
//             id,
//             updateData,
//             { new: true, runValidators: true }).select("-password");
//     } catch (error) {
//         throw new Error("Error updating user: " + error.message);
//     }
// };
export const updateUser = async (id, updateData) => {
    try {
        return await User.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: "after", runValidators: true }
        ).select("-password");
    } catch (error) {
        throw new Error("Error updating user: " + error.message);
    }
};

export const getUserById = async (id) => {
    return await User.findById(id).select(
        "-password -resetPasswordToken -resetPasswordExpire"
    );
};

export const deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return await user.deleteOne();
};

export const getUsersByRole = async (role) => {
    return await User.find({ role }).select(
        "-password -resetPasswordToken -resetPasswordExpire"
    );
};

export const getAllUsers = async () => {
    const query = { role: { $ne: "Admin" } }; // Exclude Super Admin

    const users = await User.find(query).select(
        "-password -resetPasswordToken -resetPasswordExpire"
    ).sort({ createdAt: -1 }); // Sort by creation date (newest first)

    
    return users;
};