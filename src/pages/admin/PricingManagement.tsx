import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Edit, Trash2, Plus } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  razorpayAmount: number;
  popular?: boolean;
  order: number;
}

const PricingManagement = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const plansSnapshot = await getDocs(collection(db, 'pricingPlans'));
      const plansData = plansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PricingPlan[];
      setPlans(plansData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      if (editingPlan.id === 'new') {
        await addDoc(collection(db, 'pricingPlans'), {
          name: editingPlan.name,
          price: editingPlan.price,
          period: editingPlan.period,
          features: editingPlan.features,
          razorpayAmount: editingPlan.razorpayAmount,
          popular: editingPlan.popular || false,
          order: editingPlan.order,
        });
        toast.success('Plan created successfully!');
      } else {
        await updateDoc(doc(db, 'pricingPlans', editingPlan.id), {
          name: editingPlan.name,
          price: editingPlan.price,
          period: editingPlan.period,
          features: editingPlan.features,
          razorpayAmount: editingPlan.razorpayAmount,
          popular: editingPlan.popular || false,
          order: editingPlan.order,
        });
        toast.success('Plan updated successfully!');
      }
      setIsDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await deleteDoc(doc(db, 'pricingPlans', planId));
      toast.success('Plan deleted successfully!');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Plans</h1>
          <p className="text-white/70">Manage subscription tiers and pricing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPlan({
                  id: 'new',
                  name: '',
                  price: '',
                  period: 'month',
                  features: [],
                  razorpayAmount: 0,
                  popular: false,
                  order: plans.length + 1,
                });
              }}
              className="bg-[#FF2D95] hover:bg-[#FF2D95]/80 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2B0050] border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPlan?.id === 'new' ? 'Add New Plan' : 'Edit Plan'}</DialogTitle>
            </DialogHeader>
            {editingPlan && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price Display</Label>
                    <Input
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                      placeholder="₹999"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Razorpay Amount (in paisa)</Label>
                    <Input
                      type="number"
                      value={editingPlan.razorpayAmount}
                      onChange={(e) => setEditingPlan({ ...editingPlan, razorpayAmount: Number(e.target.value) })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={editingPlan.order}
                      onChange={(e) => setEditingPlan({ ...editingPlan, order: Number(e.target.value) })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Features (one per line)</Label>
                  <Textarea
                    value={editingPlan.features.join('\n')}
                    onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n').filter(f => f.trim()) })}
                    className="bg-white/10 border-white/20 text-white min-h-[120px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingPlan.popular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label>Mark as Popular</Label>
                </div>
                <Button
                  onClick={handleSavePlan}
                  className="w-full bg-[#FF2D95] hover:bg-[#FF2D95]/80 text-white"
                >
                  Save Plan
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 relative"
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#FF2D95] to-[#FF6B9D] text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
            )}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <div className="text-3xl font-bold text-[#FF2D95]">{plan.price}</div>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-[#FF2D95] mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setEditingPlan(plan);
                    setIsDialogOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeletePlan(plan.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingManagement;
