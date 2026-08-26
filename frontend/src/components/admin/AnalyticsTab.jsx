import { useEffect, useState } from 'react';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiClock, FiHeart } from 'react-icons/fi';
import { adminService } from '@/services/adminService';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Loader from '@/components/common/Loader';

const AnalyticsTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard icon={<FiUsers size={18} />} label="Total Users" value={data.totalUsers} />
      <DashboardCard icon={<FiPackage size={18} />} label="Active Products" value={data.totalProducts} accent="secondary" />
      <DashboardCard icon={<FiShoppingBag size={18} />} label="Total Orders" value={data.totalOrders} accent="accent" />
      <DashboardCard icon={<FiDollarSign size={18} />} label="Total Revenue" value={`₹${data.totalRevenue}`} />
      <DashboardCard icon={<FiClock size={18} />} label="Pending Approvals" value={data.pendingProfessionals} accent="accent" />
      <DashboardCard icon={<FiHeart size={18} />} label="Active Adoption Listings" value={data.activeAdoptions} accent="secondary" />
    </div>
  );
};

export default AnalyticsTab;
