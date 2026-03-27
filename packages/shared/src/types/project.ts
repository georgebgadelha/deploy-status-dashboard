export interface Project {
  _id: string;
  name: string;
  description: string;
  repository: string;
  status: 'active' | 'inactive';
  lastDeployAt: string | null;
  createdAt: string;
  updatedAt: string;
}
