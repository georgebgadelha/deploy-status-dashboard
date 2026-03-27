import { Schema, model, Document, Types } from 'mongoose';
import { DEPLOY_STATUS, type DeployStatus } from '@zephyr-deploy/shared';
import { ENVIRONMENTS, type Environment } from '@zephyr-deploy/shared';

export interface IDeploy extends Document {
  projectId: Types.ObjectId;
  environment: Environment;
  status: DeployStatus;
  branch: string;
  commitHash: string;
  duration: number | null;
}

const deploySchema = new Schema<IDeploy>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    environment: {
      type: String,
      enum: Object.values(ENVIRONMENTS),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DEPLOY_STATUS),
      required: true,
    },
    branch: { type: String, required: true, trim: true },
    commitHash: { type: String, required: true, trim: true },
    duration: { type: Number, default: null },
  },
  { timestamps: true },
);

deploySchema.index({ projectId: 1, createdAt: -1 });
deploySchema.index({ environment: 1 });
deploySchema.index({ status: 1 });
deploySchema.index({ createdAt: -1 });

export const DeployModel = model<IDeploy>('Deploy', deploySchema);
