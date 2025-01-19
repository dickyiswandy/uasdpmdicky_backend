const express = require('express');
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @typedef {object} JadwalRequest
 * @property {string} hari.required - Hari (Senin/Selasa/Rabu/Kamis/Jumat/Sabtu/Minggu)
 * @property {string} mataKuliah.required - Nama mata kuliah
 * @property {string} waktu.required - Waktu kuliah
 */

router.post('/', authMiddleware, TodoController.createTodo);
router.get('/', authMiddleware, TodoController.getTodos);
router.get('/hari/:hari', authMiddleware, TodoController.getTodoByHari);
router.get('/:id', authMiddleware, TodoController.getTodoById);
router.put('/:id', authMiddleware, TodoController.updateTodoById);
router.delete('/:id', authMiddleware, TodoController.deleteTodoById);

module.exports = router;
