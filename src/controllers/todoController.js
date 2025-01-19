const Todo = require('../models/todo');

class TodoController {
    async createTodo(req, res) {
        const { hari, mataKuliah, waktu } = req.body;
        const userId = req.user.id;

        try {
            // Validasi input
            if (!hari || !mataKuliah || !waktu) {
                return res.status(400).json({ 
                    message: 'Semua field harus diisi'
                });
            }

            const newTodo = new Todo({
                hari,
                mataKuliah,
                waktu,
                userId
            });

            await newTodo.save();
            res.status(201).json({
                message: 'Jadwal berhasil dibuat',
                data: newTodo
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ 
                    message: 'Error validasi', 
                    error: messages 
                });
            }
            res.status(500).json({ 
                message: 'Error server', 
                error: error.message 
            });
        }
    }

    async getTodos(req, res) {
        const userId = req.user.id;
        try {
            const todos = await Todo.find({ userId })
                .sort({ hari: 1, waktu: 1 })
                .select('-__v');
                
            res.status(200).json({ 
                message: 'Berhasil mengambil data jadwal',
                data: todos 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error server', 
                error: error.message 
            });
        }
    }

    async getTodoByHari(req, res) {
        const userId = req.user.id;
        const { hari } = req.params;

        try {
            const todos = await Todo.find({
                userId,
                hari: new RegExp(`^${hari}$`, 'i')
            })
            .sort({ waktu: 1 })
            .select('-__v');

            if (!todos.length) {
                return res.status(404).json({ 
                    message: 'Jadwal tidak ditemukan untuk hari ini' 
                });
            }

            res.status(200).json({ 
                message: 'Berhasil mengambil data jadwal',
                data: todos 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error server', 
                error: error.message 
            });
        }
    }

    async getTodoById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const todo = await Todo.findOne({ _id: id, userId })
                .select('-__v');

            if (!todo) {
                return res.status(404).json({ 
                    message: 'Jadwal tidak ditemukan' 
                });
            }

            res.status(200).json({ 
                message: 'Berhasil mengambil data jadwal',
                data: todo 
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ 
                    message: 'ID jadwal tidak valid' 
                });
            }
            res.status(500).json({ 
                message: 'Error server', 
                error: error.message 
            });
        }
    }

    async updateTodoById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const { hari, mataKuliah, waktu } = req.body;

        try {
            // Validasi input
            if (!hari || !mataKuliah || !waktu) {
                return res.status(400).json({ 
                    message: 'Semua field harus diisi'
                });
            }

            const updatedTodo = await Todo.findOneAndUpdate(
                { _id: id, userId },
                { hari, mataKuliah, waktu },
                { 
                    new: true,
                    runValidators: true 
                }
            ).select('-__v');

            if (!updatedTodo) {
                return res.status(404).json({ 
                    message: 'Jadwal tidak ditemukan' 
                });
            }

            res.status(200).json({
                message: 'Jadwal berhasil diperbarui',
                data: updatedTodo
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(val => val.message);
                return res.status(400).json({ 
                    message: 'Error validasi', 
                    error: messages 
                });
            } else if (error.name === 'CastError') {
                return res.status(400).json({ 
                    message: 'ID jadwal tidak valid' 
                });
            }
            res.status(500).json({ 
                message: 'Error server', 
                error: error.message 
            });
        }
    }

    async deleteTodoById(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

            if (!deletedTodo) {
                return res.status(404).json({ 
                    message: 'Jadwal tidak ditemukan' 
                });
            }

            res.status(200).json({ 
                message: 'Jadwal berhasil dihapus',
                data: deletedTodo
            });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).json({ 
                    message: 'ID jadwal tidak valid' 
                });
            }
            res.status(500).json({ 
                message: 'Error server', 
                error: error.message 
            });
        }
    }
}

module.exports = new TodoController();