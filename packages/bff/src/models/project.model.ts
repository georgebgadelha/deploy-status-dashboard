import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  repository: string;
  status: 'active' | 'inactive';
  lastDeployAt: Date | null;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    repository: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastDeployAt: { type: Date, default: null },
  },
  { timestamps: true },
);

projectSchema.index({ status: 1 });

export const ProjectModel = model<IProject>('Project', projectSchema);
