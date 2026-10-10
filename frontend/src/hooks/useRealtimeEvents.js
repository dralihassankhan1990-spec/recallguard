import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../services/api.js';

const EVENT_TYPES = [
    'CONNECTED',
    'ALERT_INGESTED',
    'SUPPLIER_MATCHED',
    'RISK_ASSESSED',
    'SUPPLIER_FLAGGED',
    'ACTION_CREATED',
    'BATCH_HOLD_TRIGGERED',
    'SUPPLIER_AUDIT_REQUESTED'
];

/**
 * Subscribes to the RecallGuard SSE stream (GET /api/events) and calls
 * `onEvent(type, data)` for every event. Returns { connected }.
 *
 * The callback is held in a ref so the subscription is created once —
 * passing an inline callback from a parent will NOT reconnect on re-render.
 */
export function useRealtimeEvents(onEvent) {
    const [connected, setConnected] = useState(false);
    const callbackRef = useRef(onEvent);
    callbackRef.current = onEvent;

    useEffect(() => {
        const source = new EventSource(`${API_BASE_URL}/events`);

        const handle = (event) => {
            let data = null;
            try {
                data = JSON.parse(event.data);
            } catch {
                data = event.data;
            }
            callbackRef.current(event.type, data);
        };

        source.onopen = () => setConnected(true);
        source.onerror = () => setConnected(false);
        EVENT_TYPES.forEach((type) => source.addEventListener(type, handle));

        return () => {
            EVENT_TYPES.forEach((type) => source.removeEventListener(type, handle));
            source.close();
            setConnected(false);
        };
    }, []);

    return { connected };
}
