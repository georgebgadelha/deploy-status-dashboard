import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { CONFIG } from '../../config/constants';
import styles from './QuickDeploy.module.css';

interface Project {
  _id: string;
  name: string;
}

type Step = 'closed' | 'form' | 'deploying' | 'done' | 'error';

const ENVIRONMENTS = ['production', 'staging', 'preview'];
const BRANCHES = ['main', 'develop', 'feature/new-ui', 'fix/hotfix-auth'];

export default function QuickDeploy() {
  const [step, setStep] = useState<Step>('closed');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState('');
  const [environment, setEnvironment] = useState('staging');
  const [branch, setBranch] = useState('main');
  const [errorMsg, setErrorMsg] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.data || []);
    } catch {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    if (step === 'form') {
      loadProjects();
    }
  }, [step, loadProjects]);

  const handleOpen = () => {
    setStep('form');
    setProjectId('');
    setEnvironment('staging');
    setBranch('main');
    setErrorMsg('');
  };

  const handleDeploy = async () => {
    if (!projectId) return;
    setStep('deploying');

    try {
      const res = await api.createDeploy(projectId, environment, branch);
      const id = res.data?._id;

      setTimeout(async () => {
        try {
          const finalStatus = Math.random() > CONFIG.DEPLOY_SIMULATION.SUCCESS_RATE ? 'failed' : 'success';
          await api.updateDeployStatus(id, finalStatus);
          setStep('done');
        } catch {
          setStep('done');
        }
      }, CONFIG.DEPLOY_SIMULATION.DURATION_MIN_MS + 
         Math.random() * (CONFIG.DEPLOY_SIMULATION.DURATION_MAX_MS - CONFIG.DEPLOY_SIMULATION.DURATION_MIN_MS));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Deploy failed');
      setStep('error');
    }
  };

  if (step === 'closed') {
    return (
      <button className={styles.fab} onClick={handleOpen} title="Trigger Deploy">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <div className={styles.overlay} onClick={() => setStep('closed')} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {step === 'form' && 'Trigger Deploy'}
            {step === 'deploying' && 'Deploying...'}
            {step === 'done' && 'Deploy Complete'}
            {step === 'error' && 'Deploy Failed'}
          </h3>
          <button className={styles.close} onClick={() => setStep('closed')}>×</button>
        </div>

        {step === 'form' && (
          <div className={styles.body}>
            <label className={styles.label}>
              Project
              <select
                className={styles.select}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Environment
              <select
                className={styles.select}
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
              >
                {ENVIRONMENTS.map((env) => (
                  <option key={env} value={env}>{env}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Branch
              <select
                className={styles.select}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <button
              className={styles.deployBtn}
              onClick={handleDeploy}
              disabled={!projectId}
            >
              Deploy Now
            </button>
          </div>
        )}

        {step === 'deploying' && (
          <div className={styles.body}>
            <div className={styles.progress}>
              <div className={styles.progressBar} />
            </div>
            <p className={styles.statusText}>
              Building and deploying to <strong>{environment}</strong>...
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className={styles.body}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.statusText}>
              Deploy finished. Refresh the page to see updated metrics.
            </p>
            <button className={styles.deployBtn} onClick={() => setStep('closed')}>
              Close
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className={styles.body}>
            <div className={styles.errorIcon}>✗</div>
            <p className={styles.statusText}>{errorMsg}</p>
            <button className={styles.deployBtn} onClick={handleOpen}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
