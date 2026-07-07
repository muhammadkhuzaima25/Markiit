import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { FiSearch, FiUser, FiCheck, FiX } from 'react-icons/fi';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, limit: 15, search: searchQuery });
      const userData = data;
      setUsers(Array.isArray(userData) ? userData : (userData.users || userData.data || []));
      setTotalPages(userData.totalPages || 1);
    } catch {} finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleSuspend = async (userId) => {
    try {
      await adminAPI.suspendUser(userId);
      toast.success('User status updated');
      fetchUsers();
    } catch { toast.error('Failed to update user'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Manage Users</h1>
        <p className="text-sm text-charcoal-light mt-1">View and manage user accounts</p>
      </div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" size={18} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark border-none cursor-pointer">Search</button>
      </form>

      {loading ? <Loader /> : users.length === 0 ? (
        <p className="text-charcoal-light text-sm text-center py-8">No users found</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-neutral">
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">User</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Role</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-charcoal">Joined</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-border last:border-0 hover:bg-neutral/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center"><FiUser size={14} className="text-charcoal-light" /></div>}
                        <span className="text-sm font-medium text-charcoal">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-light">{u.email}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-neutral text-charcoal-light'}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                    <td className="px-4 py-3 text-sm text-charcoal-light">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleSuspend(u._id)} className={`text-xs px-3 py-1.5 rounded-lg border-none cursor-pointer font-medium ${u.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                          {u.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
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

export default AdminUsersPage;
