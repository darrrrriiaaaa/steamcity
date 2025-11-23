import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    submissionURL: {
        type: String, 
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    grade: {
        type: Number,
    },
    feedback: {
        type: String,
    },
    isGraded: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;