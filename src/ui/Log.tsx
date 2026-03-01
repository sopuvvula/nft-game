import { useEffect, useRef } from 'react';
import './Log.css';

function getLogType(msg: string): { color: string; type: string } {
  if (msg.toLowerCase().includes('wins'))   return { color: '#fbbf24', type: 'win' };
  if (msg.includes('destroyed'))            return { color: '#f97316', type: 'destroy' };
  if (msg.includes('dmg') || msg.includes('hit') || msg.includes('Core'))
                                            return { color: '#f87171', type: 'damage' };
  if (msg.includes("'s turn") || msg.includes('Game started'))
                                            return { color: '#60a5fa', type: 'turn' };
  if (msg.includes('played'))               return { color: '#4ade80', type: 'play' };
  if (msg.includes('Combat') || msg.includes('combat'))
                                            return { color: '#fb923c', type: 'combat' };
  if (msg.includes('skipped'))              return { color: '#6b7280', type: 'skip' };
  return                                           { color: '#374151', type: 'default' };
}

interface LogProps {
  messages: string[];
}

export function Log({ messages }: LogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={ref} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
      {messages.map((msg, i) => {
        const { color, type } = getLogType(msg);
        return (
          <div key={i} className={`log-entry type-${type}`} style={{ color }}>
            {msg}
          </div>
        );
      })}
    </div>
  );
}
