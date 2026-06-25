import React from 'react';

export function SkeletonCard() {
  return (
    <div className="sk-card">
      <div className="sk-img sk-pulse" />
      <div className="sk-body">
        <div className="sk-line sk-pulse" style={{ width: '40%', height: 11 }} />
        <div className="sk-line sk-pulse" style={{ width: '90%', height: 14 }} />
        <div className="sk-line sk-pulse" style={{ width: '70%', height: 14 }} />
        <div className="sk-footer">
          <div className="sk-line sk-pulse" style={{ width: '30%', height: 18 }} />
          <div className="sk-circle sk-pulse" />
        </div>
      </div>
      <style>{`
        .sk-card {
          background: white;
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .sk-img {
          aspect-ratio: 1;
          width: 100%;
        }
        .sk-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sk-line {
          border-radius: 6px;
        }
        .sk-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
        }
        .sk-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .sk-pulse {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function SkeletonProductGrid({ count = 8 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 24 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonProductPage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, padding: '28px 0 100px' }}>
      <div className="sk-page-img sk-pulse" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[11, 28, 20, 60, 16, 16, 50, 16].map((h, i) => (
          <div key={i} className="sk-pulse" style={{ height: h, borderRadius: 8, width: i === 0 ? '30%' : i === 1 ? '80%' : i === 4 ? '50%' : '100%' }} />
        ))}
      </div>
      <style>{`
        .sk-page-img {
          aspect-ratio: 1;
          border-radius: var(--radius);
        }
        .sk-pulse {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
