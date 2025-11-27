import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  cashfreeOrderId?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const txnData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Transaction[];

        setTransactions(txnData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const getRemainingTime = () => {
    if (!subscription) return null;
    if (subscription.isLifetime) return 'Lifetime Access';
    if (!subscription.isActive) return 'Expired';

    const now = new Date();
    const end = subscription.endDate;
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return 'Expired';
    if (days === 1) return '1 day remaining';
    return `${days} days remaining`;
  };

  const getSubscriptionProgress = () => {
    if (!subscription || subscription.isLifetime) return 100;
    if (!subscription.isActive) return 0;

    const start = subscription.startDate.getTime();
    const end = subscription.endDate.getTime();
    const now = new Date().getTime();

    const total = end - start;
    const elapsed = now - start;

    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const accountCreatedDate = user?.metadata.creationTime
    ? format(new Date(user.metadata.creationTime), 'MMM dd, yyyy')
    : 'N/A';

  if (subLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-white/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calculator
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription and view transaction history
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Account Created</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accountCreatedDate}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subscription?.planName || 'No Plan'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Status */}
          <Card className="bg-card/50 backdrop-blur-xl border-border mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Subscription Status</CardTitle>
                  <CardDescription>Your current plan details</CardDescription>
                </div>
                {subscription && (
                  <Badge
                    variant={subscription.isActive ? 'default' : 'destructive'}
                    className={subscription.isActive ? 'bg-gradient-to-r from-primary to-accent' : ''}
                  >
                    {subscription.isActive ? 'Active' : 'Expired'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-semibold">{subscription.planName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Remaining
                      </span>
                      <span className="font-semibold">{getRemainingTime()}</span>
                    </div>
                    {!subscription.isLifetime && subscription.isActive && (
                      <>
                        <Progress value={getSubscriptionProgress()} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{format(subscription.startDate, 'MMM dd, yyyy')}</span>
                          <span>{format(subscription.endDate, 'MMM dd, yyyy')}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => navigate('/upgrade')}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow)]"
                  >
                    {subscription.isActive ? 'Upgrade Plan' : 'Renew Subscription'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have an active subscription</p>
                  <Button
                    onClick={() => navigate('/upgrade')}
                    className="bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow)]"
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Transaction History</CardTitle>
              <CardDescription>Your payment history and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>{format(txn.createdAt, 'MMM dd, yyyy')}</TableCell>
                          <TableCell className="font-medium">{txn.planName}</TableCell>
                          <TableCell>
                            {txn.currency} ${(txn.amount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={txn.status === 'success' ? 'default' : 'destructive'}
                              className={txn.status === 'success' ? 'bg-green-600' : ''}
                            >
                              {txn.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {txn.cashfreeOrderId?.substring(0, 20)}...
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
