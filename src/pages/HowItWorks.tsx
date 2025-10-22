import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calculator
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Understanding the Trading Calculator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">
                This advanced trading calculator helps you manage your trades by calculating optimal trade amounts,
                tracking wins and losses, and maintaining a comprehensive history of your trading activity.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Key Parameters</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Initial Amount:</strong> Your starting capital for trading</li>
                <li><strong>1st Win after n Trade (n):</strong> Number of trades before first expected win</li>
                <li><strong>Loss % Captured (l):</strong> Percentage of loss you're willing to capture</li>
                <li><strong>Profit % Captured (m):</strong> Target profit percentage per trade</li>
                <li><strong>Leverage (t):</strong> Trading leverage multiplier</li>
                <li><strong>Fee+GST (f):</strong> Transaction fees including GST</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">How to Use</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Enter your initial trading parameters</li>
                <li>Click "Initialize" to start tracking</li>
                <li>Record each trade outcome by clicking "Win" or "Loss"</li>
                <li>View your trading history and statistics</li>
                <li>Use undo/redo to correct mistakes</li>
                <li>Your progress is automatically saved to the cloud</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Computed Values</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Divisor:</strong> Calculated factor for trade amount determination</li>
                <li><strong>Loss % (p):</strong> Effective loss percentage including fees</li>
                <li><strong>Profit % (q):</strong> Effective profit percentage excluding fees</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Real-time calculation of trade amounts</li>
                <li>Comprehensive trading history with undo/redo</li>
                <li>Win/Loss statistics tracking</li>
                <li>Cloud-based progress saving</li>
                <li>Mobile-responsive design</li>
                <li>CSV export functionality</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;
