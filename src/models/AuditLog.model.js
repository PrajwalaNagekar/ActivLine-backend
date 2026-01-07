import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    adminType: {
        type: String,
        enum: ['Admin', 'SubAdmin'],
        required: true,
    },
    action: {
        type: String,
        required: true,
        // e.g., 'created_user', 'updated_plan', 'deleted_subadmin', 'viewed_all_users'
    },
    module: {
        type: String,
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    ipAddress: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);