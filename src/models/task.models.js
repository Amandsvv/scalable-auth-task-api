import mongoose from "mongoose"
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        defailt : ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

TaskSchema.index({ owner: 1 });
const Task = mongoose.model("Task", TaskSchema);

export default Task;