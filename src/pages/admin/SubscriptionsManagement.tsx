import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Download } from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  planType: string;
  startDate: any;
  endDate: any;
  paymentId?: string;
}

interface User {
  id: string;
  email: string;
}

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscriptions
        const subsSnapshot = await getDocs(collection(db, 'subscriptions'));
        const subsData = subsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Subscription[];
        setSubscriptions(subsData);

        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersMap: Record<string, User> = {};
        usersSnapshot.forEach(doc => {
          usersMap[doc.id] = { id: doc.id, email: doc.data().email };
        });
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatus = (sub: Subscription) => {
    const endDate = sub.endDate?.toDate();
    return endDate && endDate > new Date() ? 'Active' : 'Expired';
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const userEmail = users[sub.id]?.email || '';
    const matchesSearch = userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStatus(sub);
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && status === 'Active') ||
      (filterStatus === 'expired' && status === 'Expired');
    
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Plan', 'Start Date', 'End Date', 'Status', 'Payment ID'].join(','),
      ...filteredSubscriptions.map(sub => [
        users[sub.id]?.email || '',
        sub.planType,
        sub.startDate?.toDate().toLocaleDateString() || '',
        sub.endDate?.toDate().toLocaleDateString() || '',
        getStatus(sub),
        sub.paymentId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2D95]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
        <p className="text-white/70">View and manage active subscriptions</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email..."
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterStatus('all')}
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              className={filterStatus === 'all' ? 'bg-[#FF2D95]' : 'border-white/20 text-white hover:bg-white/10'}
            >
              All
            </Button>
            <Button
              onClick={() => setFilterStatus('active')}
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              className={filterStatus === 'active' ? 'bg-green-500' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Active
            </Button>
            <Button
              onClick={() => setFilterStatus('expired')}
              variant={filterStatus === 'expired' ? 'default' : 'outline'}
              className={filterStatus === 'expired' ? 'bg-yellow-500' : 'border-white/20 text-white hover:bg-white/10'}
            >
              Expired
            </Button>
          </div>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Plan</TableHead>
                <TableHead className="text-white">Start Date</TableHead>
                <TableHead className="text-white">End Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Payment ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => {
                const status = getStatus(sub);
                return (
                  <TableRow key={sub.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white">{users[sub.id]?.email || '-'}</TableCell>
                    <TableCell className="text-white/70 capitalize">{sub.planType}</TableCell>
                    <TableCell className="text-white/70">
                      {sub.startDate?.toDate().toLocaleDateString() || '-'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {sub.endDate?.toDate().toLocaleDateString() || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status === 'Active' ? 'default' : 'secondary'}
                        className={
                          status === 'Active'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/70 text-sm">{sub.paymentId || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionsManagement;
