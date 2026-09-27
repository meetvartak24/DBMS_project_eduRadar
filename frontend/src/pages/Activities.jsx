import React from 'react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { Empty } from '../components/common/Empty.jsx';

export function Activities({ page, data }) {
  return (
    page === 'Activities' &&
    data && (
      <section className="panel">
        <h2>
          Activities & achievements <span className="tag">{data.events.length} events</span>
        </h2>
        {data.events.length ? (
          data.events.map((e) => (
            <div className="event" key={e.id}>
              <span className="event-icon">
                <Trophy />
              </span>
              <div>
                <strong>{e.name}</strong>
                <small>{new Date(e.event_date).toLocaleDateString('en-IN')}</small>
                <span className="tag">{e.status}</span>
              </div>
              {e.certificate && (
                <a className="text-btn" href={e.certificate} target="_blank" rel="noreferrer">
                  View certificate <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          ))
        ) : (
          <Empty text="Your faculty can add events, achievements, and certificate links." />
        )}
      </section>
    )
  );
}
