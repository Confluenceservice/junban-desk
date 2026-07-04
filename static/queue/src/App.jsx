import React, { useCallback, useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import QueueTable from './QueueTable';
import TicketDetail from './TicketDetail';

// How often the queue table refreshes itself in the background.
const POLL_INTERVAL_MS = 30_000;

const FILTER_STORAGE_KEY = 'redesk.queue.filter';

// localStorage can throw in a sandboxed iframe, so wrap access.
function loadSavedFilter() {
  try {
    const saved = window.localStorage.getItem(FILTER_STORAGE_KEY);
    return ['all', 'unassigned', 'mine'].includes(saved) ? saved : 'all';
  } catch (err) {
    console.warn('localStorage unavailable, filter will not persist', err);
    return 'all';
  }
}

function saveFilter(filter) {
  try {
    window.localStorage.setItem(FILTER_STORAGE_KEY, filter);
  } catch {
    // Storage unavailable — filter just won't survive a reload.
  }
}

/**
 * re-desk queue workspace.
 *
 * Layout: "needs action" ticket table on the left, inline detail pane
 * (comment thread + reply box) on the right. Replaces the default JSM
 * queue views with only what agents need.
 */
const App = () => {
  const [queue, setQueue] = useState({ status: 'loading' });
  const [selectedKey, setSelectedKey] = useState(null);
  // 'all' | 'unassigned' | 'mine' — applied client-side to the loaded queue.
  const [filter, setFilterState] = useState(loadSavedFilter);

  const setFilter = useCallback((f) => {
    setFilterState(f);
    saveFilter(f);
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      const data = await invoke('getQueue');
      setQueue({ status: 'ready', data });
    } catch (err) {
      console.error('Failed to load queue', err);
      // Keep showing the last good table on a failed background
      // refresh; only surface the error if we have nothing to show.
      setQueue((prev) =>
        prev.status === 'ready' ? prev : { status: 'error', message: err.message }
      );
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // Background poll so new tickets appear without a manual refresh.
  // Skips ticks while the tab is hidden to save invocations, and
  // refreshes immediately when the agent returns to the tab.
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) loadQueue();
    };
    const interval = setInterval(tick, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [loadQueue]);

  // Called by the detail pane after a reply/transition so the table
  // reflects the new state (e.g. ticket left the needs-action list).
  const handleTicketChanged = useCallback(() => {
    loadQueue();
  }, [loadQueue]);

  if (queue.status === 'loading') {
    return <div className="message">Loading queue…</div>;
  }
  if (queue.status === 'error') {
    return (
      <div className="message error">Could not load queue: {queue.message}</div>
    );
  }

  const { issues, project, currentUser } = queue.data;

  const filtered = issues.filter((i) => {
    if (filter === 'unassigned') return !i.assigneeId;
    if (filter === 'mine') return i.assigneeId === currentUser.accountId;
    return true;
  });

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'unassigned', label: 'Unassigned' },
    { id: 'mine', label: 'Assigned to me' },
  ];

  return (
    <div className="workspace">
      <div className="queue-pane">
        <div className="queue-header">
          <h2 className="queue-title">Needs action</h2>
          <span className="queue-count">
            {filtered.length} of {issues.length} ticket
            {issues.length === 1 ? '' : 's'} in {project.key}
          </span>
          <button className="refresh-button" onClick={loadQueue}>
            Refresh
          </button>
        </div>
        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={filter === f.id ? 'filter-button active' : 'filter-button'}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <QueueTable
          issues={filtered}
          selectedKey={selectedKey}
          onSelect={setSelectedKey}
        />
      </div>
      <div className="detail-pane">
        {selectedKey ? (
          <TicketDetail
            issueKey={selectedKey}
            onTicketChanged={handleTicketChanged}
          />
        ) : (
          <div className="message">Select a ticket to view its thread.</div>
        )}
      </div>
    </div>
  );
};

export default App;
