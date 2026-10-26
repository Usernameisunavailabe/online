import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal.jsx";
import { Button } from "../common/Button.jsx";
import { getTodayDateString } from "../../utils/dates.js";
import { useApp } from "../../context/AppContext.jsx";

export function RevisionModal({
  isOpen,
  onClose,
  initialProblem = null
}) {
  const { questions, addRevision } = useApp();

  const [problemId, setProblemId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [revisionNotes, setRevisionNotes] = useState("");

  useEffect(() => {
    if (initialProblem) {
      setProblemId(initialProblem.id);
    } else if (questions.length > 0 && !problemId) {
      setProblemId(questions[0].id);
    }
  }, [initialProblem, questions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetQ = questions.find((q) => q.id === problemId);
    if (!targetQ) return;

    addRevision({
      problemId: targetQ.id,
      problemTitle: targetQ.title,
      difficulty: targetQ.difficulty,
      scheduledDate,
      revisionNotes
    });

    onClose();
    setRevisionNotes("");
  };

  const selectedQ = questions.find((q) => q.id === problemId) || questions[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Problem Revision"
      maxWidth="480px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Reminder
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label className="form-label">Problem</label>
          <select
            className="form-select"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.difficulty})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Revision Date</label>
          <input
            type="date"
            className="form-input"
            value={scheduledDate}
            min={getTodayDateString()}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="form-label">Revision Focus / Notes</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. Revisit time complexity, code without looking at editorial, test edge cases..."
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
