import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema({
    name : {
            type : String,
            required : [true, " Deadline name/title is required"],
            trim : true,
            maxLength : [100, "Deadline name cannot exceed 100 characters"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Creator ID is required"],
    },
    Project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default : null,
    },
    
},
{
    // Give us createdAt and updatedAt fields automatically
    timestamps: true,
}
);

// indexing for better query performance
deadlineSchema.index({ dueDate: 1 });
deadlineSchema.index({ createdBy: 1 });
deadlineSchema.index({ Project: 1 });


export const Deadline = mongoose.models.Deadline || mongoose.model("Deadline", deadlineSchema);