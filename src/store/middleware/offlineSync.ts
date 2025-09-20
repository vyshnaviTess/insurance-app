import type { Middleware } from '@reduxjs/toolkit';
import NetInfo from '@react-native-community/netinfo';
import { dequeue } from '../offlineQueueSlice';
import { ApiClient } from '../../data/api/client';
import { RemotePolicyRepository } from '../../data/repositories/policyRepository';
import { API_BASE_URL } from '@/config/env';

const api = new ApiClient({ baseUrl: API_BASE_URL });
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
        try {
          console.log("Flushing job:", job);

          if (job.entity === 'policy') {
            if (job.type === 'CREATE') {
              await repo.create(job.payload);
            } else if (job.type === 'UPDATE') {
              await repo.update(job.payload);
            } else if (job.type === 'DELETE') {
              console.log("Deleting from server:", job.payload.id);
              await repo.remove(job.payload.id);
            }

            // only dequeue if success
            store.dispatch(dequeue(job.id));
          }
        } catch (err) {
          console.warn("Job failed, leaving in queue for retry:", err);
          // do not dequeue → keep it for next retry
        }
      }
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
