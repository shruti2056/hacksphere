import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { Star, Award, CheckCircle2, ShieldAlert, Github, Globe, Youtube, Sliders, Send } from 'lucide-react';

export const JudgeDashboard = () => {
  const { user } = useAuth();
  const [assignedData, setAssignedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Rubric Modal State
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [criteriaScores, setCriteriaScores] = useState([]);
  const [comments, setComments] = useState('');

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reviews/assigned');
      setAssignedData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const openEvaluationModal = (submission) => {
    setSelectedSub(submission);
    const hackathonCriteria = submission.hackathonId?.criteria || [
      { name: 'Innovation & Novelty', maxMarks: 10 },
      { name: 'Technical Complexity', maxMarks: 10 },
      { name: 'UI / UX Design', maxMarks: 10 },
      { name: 'Functionality', maxMarks: 10 },
      { name: 'Scalability', maxMarks: 10 },
      { name: 'Presentation & Pitch', maxMarks: 10 },
    ];

    if (submission.myReview && submission.myReview.scores) {
      setCriteriaScores(submission.myReview.scores);
      setComments(submission.myReview.comments || '');
    } else {
      setCriteriaScores(
        hackathonCriteria.map((c) => ({
          criterionName: c.name,
          marks: 8,
          maxMarks: c.maxMarks || 10,
        }))
      );
      setComments('');
    }
    setEvalModalOpen(true);
  };

  const handleScoreChange = (index, value) => {
    const newScores = [...criteriaScores];
    const val = Math.min(10, Math.max(0, Number(value)));
    newScores[index].marks = val;
    setCriteriaScores(newScores);
  };

  const calculateTotalScore = () => {
    return criteriaScores.reduce((sum, item) => sum + (Number(item.marks) || 0), 0);
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await API.post('/reviews', {
        submissionId: selectedSub._id,
        hackathonId: selectedSub.hackathonId._id || selectedSub.hackathonId,
        scores: criteriaScores,
        comments,
      });
      setMsg({ type: 'success', text: `Evaluation for '${selectedSub.projectName}' submitted successfully!` });
      setEvalModalOpen(false);
      fetchAssigned();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to submit evaluation' });
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto py-12 text-center text-gray-400">Loading Judge Evaluation Portal...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Jury Rubric Portal
        </span>
        <h1 className="text-3xl font-extrabold text-white font-heading mt-2">
          Judge <span className="gradient-text">Evaluation Workspace</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Review assigned hackathon projects using standard multi-criteria scoring rubrics.
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Submissions List */}
      <div className="glass-panel rounded-2xl border border-gray-800 p-6 space-y-6">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <Star className="w-5 h-5 text-emerald-400" /> Assigned Projects ({assignedData?.submissions?.length || 0})
        </h2>

        {assignedData?.submissions?.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No projects currently assigned to you for judging.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedData?.submissions?.map((sub) => (
              <div key={sub._id} className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-indigo-400 font-semibold">{sub.hackathonId?.title}</span>
                    {sub.isEvaluated ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Evaluated ({sub.myReview?.totalScore} pts)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Review Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white font-heading">{sub.projectName}</h3>
                  <p className="text-xs text-gray-400 mt-1">Team: <strong className="text-white">{sub.teamId?.name}</strong></p>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">{sub.problemStatement}</p>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sub.githubUrl && (
                      <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-900 text-gray-400 hover:text-indigo-400">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {sub.liveDemoUrl && (
                      <a href={sub.liveDemoUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-900 text-gray-400 hover:text-indigo-400">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => openEvaluationModal(sub)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-btn shadow-md flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" /> {sub.isEvaluated ? 'Edit Score' : 'Evaluate Rubric'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rubric Evaluation Modal */}
      <Modal isOpen={evalModalOpen} onClose={() => setEvalModalOpen(false)} title={`Evaluate Project: '${selectedSub?.projectName}'`}>
        <form onSubmit={handleSubmitEvaluation} className="space-y-6">
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            <strong>Team:</strong> {selectedSub?.teamId?.name} • <strong>Hackathon:</strong> {selectedSub?.hackathonId?.title}
          </div>

          {/* Criteria Sliders / Inputs */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Multi-Criteria Score Matrix (0-10 Marks Each):</h4>
            {criteriaScores.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{c.criterionName}</span>
                  <span className="font-mono font-bold text-amber-400">{c.marks} / 10 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={c.marks}
                  onChange={(e) => handleScoreChange(i, e.target.value)}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 flex justify-between items-center text-sm font-bold">
            <span className="text-gray-300">Total Computed Evaluation Score:</span>
            <span className="text-amber-400 font-heading text-xl">{calculateTotalScore()} / {criteriaScores.length * 10} pts</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Judge Feedback & Comments</label>
            <textarea
              rows="3"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback for the team..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-semibold text-white gradient-btn shadow-md flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Official Score & Feedback
          </button>
        </form>
      </Modal>
    </div>
  );
};
