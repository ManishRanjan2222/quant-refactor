import TradingCalculator from '@/components/TradingCalculator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TradingCalculator />
      <Footer />
    </div>
  );
};

export default Index;
