import { connectDatabase, disconnectDatabase } from '../config';
import { ProjectModel } from '../models/project.model';
import { DeployModel } from '../models/deploy.model';
import { projects, generateDeploys } from './data';

async function seed(): Promise<void> {
  console.log('Seeding database...\n');

  await connectDatabase();

  await ProjectModel.deleteMany({});
  await DeployModel.deleteMany({});
  console.log('Cleared existing data.');

  for (const projectData of projects) {
    const project = await ProjectModel.create(projectData);
    const deployCount = Math.floor(Math.random() * 11) + 15; // 15-25
    const deploys = generateDeploys(deployCount);

    const deployDocs = deploys.map((d) => ({
      ...d,
      projectId: project._id,
    }));

    const inserted = await DeployModel.insertMany(deployDocs);

    const lastDeploy = inserted[inserted.length - 1];
    await ProjectModel.findByIdAndUpdate(project._id, {
      lastDeployAt: lastDeploy.createdAt,
    });

    console.log(`  ${project.name}: ${inserted.length} deploys`);
  }

  console.log('\nSeed completed.');
  await disconnectDatabase();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
