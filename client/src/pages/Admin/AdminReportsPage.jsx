import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FiAlertTriangle, FiCheck } from 'react-icons/fi';

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getReports();
      const reportData = data;
      setReports(Array.isArray(reportData) ? reportData : (reportData.reports || reportData.data || []));
    } catch {} finally { setLoading(false); }
  };

  const handleResolve = async (id) => {
    try {
      await adminAPI.resolveReport(id);
      toast.success('Report resolved');
      fetchReports();
    } catch { toast.error('Failed to resolve'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Reported Content</h1>
        <p className="text-sm text-charcoal-light mt-1">Review and resolve user reports</p>
      </div>
      {loading ? <Loader /> : reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <FiAlertTriangle size={40} className="text-charcoal-light mx-auto mb-3" />
          <p className="text-charcoal font-medium">No reports</p>
          <p className="text-sm text-charcoal-light mt-1">All clear! No reported content at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <FiAlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-charcoal">{report.title || 'Reported Content'}</h4>
                  <p className="text-xs text-charcoal-light">{report.reason || 'No reason provided'} · {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => handleResolve(report._id)} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-200 border-none cursor-pointer">
                <FiCheck size={14} /> Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
