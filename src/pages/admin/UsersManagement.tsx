import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: any;
  lastLoginAt?: any;
}

interface Subscription {
  userId: string;
  planType: string;
  startDate: any;
  endDate: any;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);

        // Fetch subscriptions
        const subsSnapshot = await getDocs(collection(db, 'subscriptions'));
        const subsMap: Record<string, Subscription> = {};
        subsSnapshot.forEach(doc => {
          subsMap[doc.id] = doc.data() as Subscription;
        });
        setSubscriptions(subsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubscriptionStatus = (userId: string) => {
    const sub = subscriptions[userId];
    if (!sub) return 'None';
    
    const endDate = sub.endDate?.toDate();
    if (endDate && endDate > new Date()) {
      return 'Active';
    }
    return 'Expired';
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
        <p className="text-white/70">View and manage user accounts</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email or name..."
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="text-white/70">
            Total: <span className="font-bold text-white">{filteredUsers.length}</span> users
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white">Last Login</TableHead>
                <TableHead className="text-white">Subscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const status = getSubscriptionStatus(user.id);
                return (
                  <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell className="text-white/70">{user.displayName || '-'}</TableCell>
                    <TableCell className="text-white/70">
                      {user.createdAt?.toDate().toLocaleDateString() || '-'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {user.lastLoginAt?.toDate().toLocaleDateString() || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status === 'Active' ? 'default' : 'secondary'}
                        className={
                          status === 'Active'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : status === 'Expired'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            : 'bg-white/10 text-white/70 border-white/20'
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
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

export default UsersManagement;
