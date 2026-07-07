import { useAuth } from '../../context/AuthContext';
import { FiMapPin, FiPackage, FiTool, FiUser, FiEdit, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import StarRating from '../../components/common/StarRating';
import UserLayout from '../../components/layout/UserLayout';

const UserProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-neutral flex items-center justify-center text-charcoal-light">
                <FiUser size={40} />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-charcoal mb-1">{user.name}</h1>
              {user.locationName && (
                <p className="text-sm text-charcoal-light flex items-center gap-1 justify-center md:justify-start mb-2">
                  <FiMapPin size={14} /> {user.locationName}
                </p>
              )}
              {user.bio && <p className="text-sm text-charcoal-light mb-3">{user.bio}</p>}
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                  {user.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-neutral text-charcoal px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-1">
                  <StarRating rating={user.ratings || 0} readonly size={16} />
                  <span className="text-sm text-charcoal-light">({user.numReviews || 0})</span>
                </div>
                <span className="text-sm text-charcoal-light">{user.products?.length || 0} listings</span>
              </div>
            </div>
            <Link
              to="/edit-profile"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light no-underline flex items-center gap-1"
            >
              <FiEdit size={14} /> Edit
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfilePage;