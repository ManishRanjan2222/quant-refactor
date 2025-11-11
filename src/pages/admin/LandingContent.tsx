import { Card } from '@/components/ui/card';

const LandingContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Landing Content</h1>
        <p className="text-white/70">Manage homepage content and sections</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6">
        <p className="text-white/70">Landing content management coming soon...</p>
      </Card>
    </div>
  );
};

export default LandingContent;
