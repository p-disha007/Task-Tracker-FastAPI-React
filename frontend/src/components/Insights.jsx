import React from 'react';

function Insights({ insights }) {
  return (
    <section className="card insights-panel">
      <h2>Smart Insights</h2>
      {insights ? (
        <blockquote>
          {insights.summary_message}
        </blockquote>
      ) : (
        <p>Loading insights...</p>
      )}
    </section>
  );
}

export default Insights;