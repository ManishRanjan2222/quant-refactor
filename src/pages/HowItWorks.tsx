import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground">
              Understanding AMMLogic.Trade - Advanced Money Management Calculator
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Advanced trading calculator for professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AMMLogic.Trade helps you manage your trades by calculating optimal trade amounts,
                  tracking wins and losses, and maintaining a comprehensive history of your trading activity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader>
                <CardTitle>Key Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Initial Amount:</strong> Your starting capital for trading</li>
                  <li><strong>1st Win after n Trade (n):</strong> Number of trades before first expected win</li>
                  <li><strong>Loss % Captured (l):</strong> Percentage of loss you're willing to capture</li>
                  <li><strong>Profit % Captured (m):</strong> Target profit percentage per trade</li>
                  <li><strong>Leverage (t):</strong> Trading leverage multiplier</li>
                  <li><strong>Fee+GST (f):</strong> Transaction fees including GST</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Subscribe to a plan to access the calculator</li>
                  <li>Enter your initial trading parameters</li>
                  <li>Click "Initialize" to start tracking</li>
                  <li>Record each trade outcome by clicking "Win" or "Loss"</li>
                  <li>View your trading history and statistics</li>
                  <li>Use undo/redo to correct mistakes</li>
                  <li>Your progress is automatically saved to the cloud</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Real-time calculation of trade amounts</li>
                  <li>Comprehensive trading history with undo/redo</li>
                  <li>Win/Loss statistics tracking</li>
                  <li>Cloud-based progress saving</li>
                  <li>Mobile-responsive design</li>
                  <li>CSV export functionality</li>
                  <li>Subscription-based access control</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorks;
