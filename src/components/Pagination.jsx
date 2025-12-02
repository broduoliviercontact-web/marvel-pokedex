import React from "react";
import "./Pagination.css";

const Pagination = ({
  page,
  limit,
  total,
  resultsLength,
  onChangePage,
  onChangeLimit,
}) => {
  const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : null;

  const goPrev = () => {
    if (page > 1) onChangePage(page - 1);
  };
  const goNext = () => {
    if (totalPages) {
      if (page < totalPages) onChangePage(page + 1);
    } else {
      if (resultsLength >= limit) onChangePage(page + 1);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10) || 10;
    onChangeLimit(newLimit);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button onClick={() => onChangePage(1)} disabled={page <= 1} aria-label="first-page">
          {"<<"}
        </button>
        <button onClick={goPrev} disabled={page <= 1} aria-label="prev-page">
          Prev
        </button>

        <div className="page-info">
          {totalPages ? (
            <span>
              Page {page} / {totalPages} — {total} item{total > 1 ? "s" : ""}
            </span>
          ) : (
            <span>
              Page {page} {resultsLength < limit ? `— ${resultsLength} item(s)` : ""}
            </span>
          )}
        </div>

        <button
          onClick={goNext}
          disabled={totalPages ? page >= totalPages : resultsLength < limit}
          aria-label="next-page"
        >
          Next
        </button>
        {totalPages ? (
          <button
            onClick={() => onChangePage(totalPages)}
            disabled={page >= totalPages}
            aria-label="last-page"
          >
            {">>"}
          </button>
        ) : null}
      </div>

      <label className="per-page">
        <span className="per-page-label">per page</span>
        <select
          value={String(limit)}
          onChange={handleLimitChange}
          aria-label="page-limit"
        >
          <option value="5">5</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;
