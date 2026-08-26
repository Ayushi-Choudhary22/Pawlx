import { useState } from 'react';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import UsersTab from '@/components/admin/UsersTab';
import OrdersTab from '@/components/admin/OrdersTab';
import AdoptionReviewTab from '@/components/admin/AdoptionReviewTab';
import CategoriesTab from '@/components/admin/CategoriesTab';
import ProductsTab from '@/components/admin/ProductsTab';

const TABS = [
  { key: 'analytics', label: 'Analytics', component: AnalyticsTab },
  { key: 'users', label: 'Users', component: UsersTab },
  { key: 'products', label: 'Products', component: ProductsTab },
  { key: 'orders', label: 'Orders', component: OrdersTab },
  { key: 'adoption', label: 'Adoption Review', component: AdoptionReviewTab },
  { key: 'categories', label: 'Categories', component: CategoriesTab },
];

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const ActiveComponent = TABS.find((t) => t.key === activeTab).component;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-6">Admin Dashboard</h1>

      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default AdminDashboardPage;
