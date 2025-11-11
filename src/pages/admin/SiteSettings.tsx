import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface SiteSettings {
  maintenanceMode: boolean;
  supportEmail: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

const defaultSettings: SiteSettings = {
  maintenanceMode: false,
  supportEmail: 'support@ammlogic.trade',
  socialLinks: {
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    youtube: '',
  },
};

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'appSettings', 'site');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() } as SiteSettings);
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
      await setDoc(doc(db, 'appSettings', 'site'), settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
        <p className="text-white/70">Configure global site settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Maintenance Mode */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Maintenance Mode</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Enable Maintenance Mode</p>
              <p className="text-white/60 text-sm mt-1">
                When enabled, all non-admin users will see a maintenance page
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Support Email</Label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Twitter URL</Label>
              <Input
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">LinkedIn URL</Label>
              <Input
                type="url"
                value={settings.socialLinks.linkedin}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Facebook URL</Label>
              <Input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Instagram URL</Label>
              <Input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                })}
                placeholder="https://instagram.com/..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">YouTube URL</Label>
              <Input
                type="url"
                value={settings.socialLinks.youtube}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                })}
                placeholder="https://youtube.com/..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
        </Card>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF2D95] hover:bg-[#FF2D95]/80 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettings;
