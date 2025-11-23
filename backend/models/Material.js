import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['document', 'link', 'text', 'assignment'],
        required: true,
    },
    content: {
        type: String, 
    },
    dueDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Material = mongoose.model('Material', materialSchema);

export default Material;