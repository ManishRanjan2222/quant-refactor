import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, RotateCcw } from 'lucide-react';

interface CalculatorDefaults {
  nTrades: number;
  l: number;
  m: number;
  t: number;
  f: number;
  initialAmount: number;
}

const defaultValues: CalculatorDefaults = {
  nTrades: 8,
  l: 1,
  m: 2,
  t: 10,
  f: 0.1,
  initialAmount: 10000,
};

const CalculatorSettings = () => {
  const [settings, setSettings] = useState<CalculatorDefaults>(defaultValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'appSettings', 'calculator');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSettings(docSnap.data() as CalculatorDefaults);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'appSettings', 'calculator'), settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultValues);
    toast.info('Reset to default values');
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
        <h1 className="text-3xl font-bold text-white mb-2">Calculator Settings</h1>
        <p className="text-white/70">Configure default values for the trading calculator</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-white">Number of Trades (nTrades)</Label>
            <Input
              type="number"
              value={settings.nTrades}
              onChange={(e) => setSettings({ ...settings, nTrades: Number(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Loss % Captured (l)</Label>
            <Input
              type="number"
              step="0.1"
              value={settings.l}
              onChange={(e) => setSettings({ ...settings, l: Number(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Profit % Captured (m)</Label>
            <Input
              type="number"
              step="0.1"
              value={settings.m}
              onChange={(e) => setSettings({ ...settings, m: Number(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Leverage (t)</Label>
            <Input
              type="number"
              value={settings.t}
              onChange={(e) => setSettings({ ...settings, t: Number(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Fee + GST (f)</Label>
            <Input
              type="number"
              step="0.01"
              value={settings.f}
              onChange={(e) => setSettings({ ...settings, f: Number(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Initial Amount</Label>
            <Input
              type="number"
              value={settings.initialAmount}
              onChange={(e) => setSettings({ ...settings, initialAmount: Number(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#FF2D95] hover:bg-[#FF2D95]/80 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CalculatorSettings;
