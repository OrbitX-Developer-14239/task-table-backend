import PostService from "../services/post.service.js"

class PostController {
    async getAll(req, res) {
        try {
            const allPosts = await PostService.getAll()
            res.status(200).json(allPosts)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getOne(req, res) {
        try {
            const post = await PostService.getOne(req.params.id)
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async create(req, res) {
        try {
            const post = await PostService.create(req.body, req.files.picture)
            res.status(201).json(post)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async delete(req, res) {
        try {
            const post = await PostService.delete(req.params.id)
            res.status(200).json(post)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async edit(req, res) {
        try {
            const { body, params } = req
            const updatedPost = await PostService.edit(body, params.id)
            res.status(200).json(updatedPost)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default new PostController