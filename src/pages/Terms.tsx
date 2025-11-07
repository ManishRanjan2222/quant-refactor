import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using AMMLogic.Trade, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Permission is granted to use AMMLogic.Trade for personal or commercial trading purposes. This license shall
              automatically terminate if you violate any of these restrictions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You may not modify or copy the materials</li>
              <li>You may not use the materials for any commercial purpose without proper subscription</li>
              <li>You may not attempt to reverse engineer any software contained in AMMLogic.Trade</li>
              <li>You may not remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">3. Subscription and Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Access to certain features requires a paid subscription. Subscriptions are billed in advance on a monthly
              basis. You are responsible for providing accurate payment information and maintaining valid payment methods.
              Failure to pay may result in suspension or termination of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">4. Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We offer a 7-day money-back guarantee for all new subscriptions. Refund requests must be submitted within
              7 days of purchase. After this period, all payments are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">5. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              AMMLogic.Trade is a calculation tool and does not provide financial advice. The materials on our platform
              are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all
              warranties including implied warranties of merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">6. Limitations of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall AMMLogic.Trade or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data, profit, or trading losses) arising out of the use or inability to use our service.
              Trading involves risk and you should only trade with money you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">7. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
              including breach of these Terms. Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">9. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">10. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at support@ammlogic.trade
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
