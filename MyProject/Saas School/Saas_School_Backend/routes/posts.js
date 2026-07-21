import express from 'express';
import multer from 'multer';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost, 
  unlikePost,
  addComment,
  getPostsByAuthor,
  savePost,
  unsavePost,
  getSavedPosts,
  getSavedPostIds,
  getAllSchoolPosts
} from '../controllers/posts.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Configure routes with proper middleware
router.get('/', getPosts);
router.get('/author', getPostsByAuthor);
router.get('/saved', getSavedPosts);
router.get('/saved/ids', getSavedPostIds);
router.get('/school', getAllSchoolPosts);
router.get('/:id', getPostById);
router.post('/', upload.single('media'), createPost); // Add multer middleware
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/unlike', unlikePost);
router.post('/:id/comment', addComment);
router.post('/:id/save', savePost);
router.post('/:id/unsave', unsavePost);

export default router;