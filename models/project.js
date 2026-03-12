import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Student ID is required"],
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null,
    },
    title : {
        type : String,
        required : [true, "Project title is required"],
        trim : true,
        maxLength : [200, "Project title cannot exceed 200 characters"],
    },
    description : {
        type : String,
        required : [true, "Project description is required"],
        trim : true,
        maxLength : [2000, "Project description cannot exceed 2000 characters"],
        },
    status : {
        type : String,
        default : "Pending",
        enum : ["Pending", "Approved", "Rejected"],
    },
    files : [{
        fileType : {
            type : String,
            required : [true, "File type is required"],
        },
        fileUrl : {
            type : String,
            required : [true, "File URL is required"],
        },
        orginalName : {
            type : String,
            required : [true, "Original name is required"],
        },
        uploadedAt : {
            type : Date,
           default : Date.now,
        }
    }],
    feedback : [{
        supervisor : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : [true, "Supervisor ID is required"],
         },
         type : {
            type : String,
            enum : ["positive", "negative", "general"],
            default : "general",
         },
         title : {
            type : String,
            required : [true, "Feedback title is required"],
         },
         message : {
            type : String,
            required : [true, "Feedback message is required"],
            trim : true,
            maxLength : [2000, "Feedback message cannot exceed 2000 characters"],
         },
    }],
    deadline : {
        type : Date,
        default : null,
    },
},
{
    // Give us createdAt and updatedAt fields automatically
    timestamps: true,
}
);

// indexing for better query performance
projectSchema.index({ student: 1 });
projectSchema.index({ supervisor: 1 });
projectSchema.index({ status: 1 });


export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);