import { useEffect, useRef } from 'react';

function getLogStyle(msg: string): { color: string; background: string } {
  if (msg.toLowerCase().includes('wins'))   return { color: '#fbbf24', background: '#1a120010' };
  if (msg.includes('destroyed'))            return { color: '#f97316', background: 'transparent' };
  if (msg.includes('dmg') || msg.includes('hit') || msg.includes('Core'))
                                            return { color: '#f87171', background: 'transparent' };
  if (msg.includes("'s turn") || msg.includes('Game started'))
                                            return { color: '#60a5fa', background: 'transparent' };
  if (msg.includes('played'))               return { color: '#4ade80', background: 'transparent' };
  if (msg.includes('Combat') || msg.includes('combat'))
                                            return { color: '#fb923c', background: 'transparent' };
  if (msg.includes('skipped'))              return { color: '#6b7280', background: 'transparent' };
  return                                           { color: '#374151', background: 'transparent' };
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
        const style = getLogStyle(msg);
        return (
          <div key={i} style={{
            fontSize: 11, lineHeight: 1.5, padding: '3px 4px',
            color: style.color, background: style.background,
            borderRadius: 2, fontFamily: 'monospace',
          }}>
            {msg}
          </div>
        );
      })}
    </div>
  );
}
