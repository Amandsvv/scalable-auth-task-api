import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Task from "../models/task.models.js";

/**
 * CREATE TASK
 */
const createTask = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        throw new ApiError(400, "Task title is required");
    }

    const task = await Task.create({
        title,
        description,
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});


/**
 * GET TASKS
 * User → own tasks
 * Admin → all tasks
 */
const getTasks = asyncHandler(async (req, res) => {

    let tasks;

    if (req.user.role === "Admin") {
        tasks = await Task.find().populate("owner", "email role");
    } else {
        tasks = await Task.find({ owner: req.user._id });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});


/**
 * UPDATE TASK
 */
const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await Task.findById(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // RBAC check ensures user owns task or is admin
    if (
        task.owner.toString() !== req.user._id.toString() &&
        req.user.role !== "Admin"
    ) {
        throw new ApiError(403, "Unauthorized to update this task");
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));
});


/**
 * DELETE TASK
 */
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (
        task.owner.toString() !== req.user._id.toString() &&
        req.user.role !== "Admin"
    ) {
        throw new ApiError(403, "Unauthorized to delete this task");
    }

    await task.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};