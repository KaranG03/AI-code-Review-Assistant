import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import './History.css'; // Import the stylesheet

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItemId, setExpandedItemId] = useState(null); // State to track expanded item
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        // NOTE: Make sure this URL matches your backend.
        const res = await fetch(`${backendUrl}/user/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, [getToken]);

  const handleToggleExpand = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  // Pagination Logic
  const reversedHistory = [...history].reverse();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reversedHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setExpandedItemId(null); // Collapse items when changing page
  };

  return (
    <div className="history-container card">
      <div className="history-header">
        <h2>Your Review History</h2>
        <p>Browse through your previously analyzed code snippets.</p>
      </div>

      {loading && <p>Loading history...</p>}
      {!loading && history.length === 0 && (
        <div className="empty-state">
          <h3>No Reviews Found</h3>
          <p>Upload a file above to get your first AI-powered code review!</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-list">
          {currentItems.map((item) => {
            const isExpanded = expandedItemId === item.reviewedAt;
            return (
              <div key={item.reviewedAt} className="history-item card-hover">
                <div className="history-item-summary" onClick={() => handleToggleExpand(item.reviewedAt)}>
                  <div className="summary-info">
                    <h4>{item["Language Detected"]} Analysis</h4>
                    <span>{new Date(item.reviewedAt).toLocaleString()}</span>
                  </div>
                  <button className={`expand-btn ${isExpanded ? 'expanded' : ''}`}>
                    &#9660;
                  </button>
                </div>

                <div className={`history-item-details ${isExpanded ? 'show' : ''}`}>
                  <div className="result-section">
                    <h3>Corrected Code</h3>
                    <pre className="code-block">{item["Correct Code"]}</pre>
                  </div>
                  <div className="feedback-grid">
                    <div className="result-section">
                      <h3 className="feedback-title positive">Positive Feedback</h3>
                      <ul className="feedback-list positive">
                        {item["Positive Feedback"]?.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                    <div className="result-section">
                      <h3 className="feedback-title critical">Critical Issues</h3>
                      {item["Critical issues"]?.length > 0 ? (
                        <ul className="feedback-list critical">
                          {item["Critical issues"].map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      ) : (
                        <div className="empty-feedback">
                          <span className="empty-feedback-icon">✅</span>
                          <p>No critical issues were found in this review.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="btn-secondary">
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="btn-secondary">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}