// node_modules
const moment = require("moment");

// utils
const { DATABASE } = require("../utils");

const createBlog = async (blogData) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector.returning("blog_id").insert("blog", blogData);
    } catch (error) {
        throw error;
    }
};

const readMainBlogsCount = async (title) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select(["COUNT (*) as count"])
            .join("comments", "blog.blog_id = comments.commentBlogId", "left")
            .where("comments.createdAt is NULL")
            .like("blog.title", `%${title}%`, "none")
            .get("blog");
    } catch (error) {
        throw error;
    }
};

const readMainBlogs = async (pageIndex, itemCount, title, sfield, dir) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select([
                "blog.blog_id",
                "blog.userId AS `userId`",
                "users.username",
                "blog.title",
                "blog.content",
                "blog.imagePath",
                "blog.createDate",
                "COUNT(likes.blogId) AS `like`",
            ])
            .join("users", "blog.userId = users.id")
            .join("likes", "blog.blog_id = likes.blogId", "left")
            .join("comments", "blog.blog_id = comments.commentBlogId", "left")
            .group_by("blog.blog_id")
            .where("comments.createdAt is NULL")
            .like("blog.title", `%${title}%`, "none")
            .order_by(sfield, dir)
            .offset((pageIndex - 1) * itemCount)
            .limit(itemCount)
            .get("blog");
    } catch (error) {
        throw error;
    }
};

const readCertainBlogs = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select([
                "MIN(blog.blog_id) as blog_id",
                "MIN(blog.userId) AS userId",
                "MIN(users.username) as username",
                "MIN(blog.title) as title",
                "MIN(blog.content) as content",
                "MIN(blog.imagePath) as imagePath",
                "MIN(comments.mainBlogId) as mainBlogId",
                "COUNT( likes.blogId ) AS `like`",
            ])
            .join("users", "blog.userId = users.id")
            .join("likes", "blog.blog_id = likes.blogId", "left")
            .join(
                "comments",
                "blog.blog_id = comments.commentBlogId OR blog.blog_id = comments.mainBlogId",
                "left"
            )
            .group_by("blog.blog_id")
            .where(`comments.mainBlogId = ${id} OR blog.blog_id = ${id}`)
            .order_by("blog.createDate")
            .get("blog");
    } catch (error) {
        throw error;
    }
};

const readCertainBlog = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select(["*"])
            .where(`blog.blog_id = ${id}`)
            .get("blog");
    } catch (error) {
        throw error;
    }
};

const readBlogs = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .select("*")
            .where({ "blog.blog_id": id })
            .get("blog");
    } catch (error) {
        throw error;
    }
};

const updateBlog = async (id, blogData) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .where({ "blog.blog_id": id })
            .set(blogData)
            .update("blog");
    } catch (error) {
        throw error;
    }
};

const deleteBlog = async (id) => {
    try {
        const dbConnector = await DATABASE.getConnection();
        return await dbConnector
            .where({ "blog.blog_id": id })
            .set({
                deletedAt: Date(),
            })
            .update("blog");
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBlog,
    readMainBlogs,
    readMainBlogsCount,
    readCertainBlogs,
    readCertainBlog,
    readBlogs,
    updateBlog,
    deleteBlog,
};
