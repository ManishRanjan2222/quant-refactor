import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    newUsersThisMonth: 0,
    estimatedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Get new users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const newUsersQuery = query(
          collection(db, 'users'),
          where('createdAt', '>=', Timestamp.fromDate(startOfMonth))
        );
        const newUsersSnapshot = await getDocs(newUsersQuery);
        const newUsersThisMonth = newUsersSnapshot.size;

        // Get active subscriptions
        const now = new Date();
        const subscriptionsSnapshot = await getDocs(collection(db, 'subscriptions'));
        let activeCount = 0;
        let revenue = 0;

        subscriptionsSnapshot.forEach((doc) => {
          const data = doc.data();
          const endDate = data.endDate?.toDate();
          
          if (endDate && endDate > now) {
            activeCount++;
            // Estimate revenue based on plan type
            const planPrices: Record<string, number> = {
              basic: 999,
              professional: 2499,
              enterprise: 4999,
            };
            revenue += planPrices[data.planType] || 0;
          }
        });

        setStats({
          totalUsers,
          activeSubscriptions: activeCount,
          newUsersThisMonth,
          estimatedRevenue: revenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D95]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Estimated Revenue',
      value: `₹${stats.estimatedRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'New Users This Month',
      value: stats.newUsersThisMonth,
      icon: TrendingUp,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome to AMMLogic Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-white/70 text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/calculator-settings"
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center"
          >
            <p className="text-white font-medium">Calculator Settings</p>
            <p className="text-white/60 text-sm mt-1">Update default values</p>
          </a>
          <a
            href="/admin/pricing"
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center"
          >
            <p className="text-white font-medium">Manage Pricing</p>
            <p className="text-white/60 text-sm mt-1">Edit subscription plans</p>
          </a>
          <a
            href="/admin/users"
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center"
          >
            <p className="text-white font-medium">View Users</p>
            <p className="text-white/60 text-sm mt-1">Manage user accounts</p>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
