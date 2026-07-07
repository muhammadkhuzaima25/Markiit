import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiPackage, FiTool, FiEye } from 'react-icons/fi';

const AdminListingsPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchListings(); }, [page, activeTab, statusFilter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (activeTab === 'products') {
        const { data } = await adminAPI.getProducts(params);
        const listData = data;
        setProducts(Array.isArray(listData) ? listData : (listData.products || listData.data || []));
        setTotalPages(listData.totalPages || 1);
      } else {
        const { data } = await adminAPI.getServices(params);
        const listData = data;
        setServices(Array.isArray(listData) ? listData : (listData.services || listData.data || []));
        setTotalPages(listData.totalPages || 1);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      if (activeTab === 'products') await adminAPI.updateProductStatus(id, status);
      else await adminAPI.updateServiceStatus(id, status);
      toast.success(`Listing ${status}`);
      fetchListings();
    } catch { toast.error('Failed to update'); }
  };

  const statusColors = { active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-orange-100 text-orange-700', removed: 'bg-red-100 text-red-700', sold: 'bg-blue-100 text-blue-700', paused: 'bg-gray-100 text-gray-700' };
  const currentListings = activeTab === 'products' ? products : services;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Manage Listings</h1>
        <p className="text-sm text-charcoal-light mt-1">Review and moderate products & services</p>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-border">
          {['products', 'services'].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer capitalize ${activeTab === tab ? 'bg-primary text-white' : 'bg-transparent text-charcoal-light hover:text-charcoal'}`}>{tab}</button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:border-primary">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="removed">Removed</option>
        </select>
      </div>

      {loading ? <Loader /> : currentListings.length === 0 ? (
        <p className="text-charcoal-light text-sm text-center py-8">No listings found</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-neutral">
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Listing</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Owner</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Price</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentListings.map((item) => (
                  <tr key={item._id} className="border-b border-border last:border-0 hover:bg-neutral/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.images?.[0] ? <img src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-neutral flex items-center justify-center">{activeTab === 'products' ? <FiPackage size={14} /> : <FiTool size={14} />}</div>}
                        <span className="text-sm font-medium text-charcoal truncate max-w-[200px]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-light">{item.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-accent">${item.price}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status] || ''}`}>{item.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(item._id, 'active')} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 border-none cursor-pointer" title="Approve"><FiCheck size={14} /></button>
                            <button onClick={() => handleStatusUpdate(item._id, 'removed')} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 border-none cursor-pointer" title="Reject"><FiX size={14} /></button>
                          </>
                        )}
                        {item.status === 'active' && (
                          <>
                            <button onClick={() => handleStatusUpdate(item._id, 'rejected')} className="p-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 border-none cursor-pointer" title="Reject"><FiX size={14} /></button>
                            <button onClick={() => handleStatusUpdate(item._id, 'removed')} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 border-none cursor-pointer" title="Remove"><FiX size={14} /></button>
                          </>
                        )}
                        {item.status === 'rejected' && (
                          <button onClick={() => handleStatusUpdate(item._id, 'active')} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 border-none cursor-pointer" title="Approve"><FiCheck size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default AdminListingsPage;
