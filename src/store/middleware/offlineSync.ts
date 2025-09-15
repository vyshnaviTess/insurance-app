import type { Middleware } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import { dequeue } from '../offlineQueueSlice';
import { ApiClient } from '../../data/api/client';
import { RemotePolicyRepository } from '../../data/repositories/policyRepository';

const api = new ApiClient({ baseUrl: 'https://mock.api' });
const repo = new RemotePolicyRepository(api);

let intervalId: ReturnType<typeof setInterval> | null = null;

const offlineSync: Middleware = store => {
  let syncing = false;

  const tryFlush = async () => {
    if (syncing) return;
    const state: any = store.getState();
    const jobs = state.offlineQueue as any[];
    if (!jobs.length) return;
    
    const net = await NetInfo.fetch();
    if (!net.isConnected) return;

    syncing = true;
    try {
      for (const job of jobs) {
        if (job.entity === 'policy') {
          if (job.type === 'CREATE') await repo.create(job.payload);
          if (job.type === 'UPDATE') await repo.update(job.payload);
          if (job.type === 'DELETE') await repo.remove(job.payload.id);
          store.dispatch(dequeue(job.id));
        }
      }
      // Optionally refetch fresh list here
    } finally {
      syncing = false;
    }
  };

if (!intervalId) {
    intervalId = setInterval(tryFlush, 4000);
  }
  return next => action => next(action);
};

// ✅ Helper to clear interval (for tests if ever needed)
export const __clearOfflineSync = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

export default offlineSync;
