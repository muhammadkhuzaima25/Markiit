import BookingHistoryPage from '../Bookings/BookingHistoryPage';
import UserLayout from '../../components/layout/UserLayout';

const UserBookingsPage = () => {
  return (
    <UserLayout>
      <BookingHistoryPage />
    </UserLayout>
  );
};

export default UserBookingsPage;