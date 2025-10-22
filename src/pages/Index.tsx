import TradingCalculator from '@/components/TradingCalculator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TestTube, FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link to="/tests">
          <Button variant="outline" className="bg-white/80 backdrop-blur shadow-lg">
            <TestTube className="mr-2 h-4 w-4" />
            Parity Tests
          </Button>
        </Link>
        <Link to="/docs">
          <Button variant="outline" className="bg-white/80 backdrop-blur shadow-lg">
            <FileText className="mr-2 h-4 w-4" />
            Documentation
          </Button>
        </Link>
      </div>
      
      <TradingCalculator />
    </div>
  );
};

export default Index;
