import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late'],
        default: 'absent',
    },
    notes: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const lessonSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    topic: {
        type: String,
    },
    duration: {
        type: String,
        default: '1h',
    },
    format: {
        type: String,
        default: 'online', 
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    attendance: [attendanceSchema] 
}, {
    timestamps: true,
});

lessonSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Group = mongoose.model('Group');
        const groupData = await Group.findById(this.group).select('students');

        if (groupData && groupData.students.length > 0) {
            this.attendance = groupData.students.map(studentId => ({
                student: studentId,
                status: 'absent'
            }));
        }
    }
    next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;