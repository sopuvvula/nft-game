import { useEffect, useRef } from 'react';

interface LogProps {
  messages: string[];
}

export function Log({ messages }: LogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: 11,
        lineHeight: 1.6,
      }}
    >
      {messages.map((msg, i) => (
        <div key={i} style={{ color: '#666', borderBottom: '1px solid #111', padding: '3px 0' }}>
          {msg}
        </div>
      ))}
    </div>
  );
}
