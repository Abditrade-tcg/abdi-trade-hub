import { UserPlus, Search, Handshake, Package } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up for free and set up your collector profile in minutes.",
    step: "01",
  },
  {
    icon: Search,
    title: "Browse & List Cards",
    description: "Search thousands of cards or list your own collection for sale.",
    step: "02",
  },
  {
    icon: Handshake,
    title: "Trade or Purchase",
    description: "Make offers, negotiate trades, or buy instantly with secure payment.",
    step: "03",
  },
  {
    icon: Package,
    title: "Ship & Receive",
    description: "Ship with confidence using our tracked shipping or arrange local pickup.",
    step: "04",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start trading in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}

              <div className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold shadow-lg">
                  {step.step}
                </div>

                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors mx-auto">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
