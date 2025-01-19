const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    hari: {
        type: String,
        enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        required: [true, 'Hari harus diisi'],
    },
    mataKuliah: {
        type: String,
        required: [true, 'Mata kuliah harus diisi'],
        trim: true
    },
    waktu: {
        type: String,
        required: [true, 'Waktu harus diisi'],
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

// Menambahkan index untuk meningkatkan performa query
todoSchema.index({ userId: 1, hari: 1 });

module.exports = mongoose.model('Todo', todoSchema);