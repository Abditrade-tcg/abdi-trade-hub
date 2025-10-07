"use client";

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
]

const HowItWorks = () => {
  return (
    <section className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Start trading in four simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in h-full" style={{ animationDelay: `${index * 0.15}s` }}>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-transparent z-10" />
              )}

              <div className="relative bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/50 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/40 hover:ring-2 hover:ring-yellow-400/30 transition-all duration-300 group h-full flex flex-col">
                {/* Step Number */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white shadow-lg z-20">
                  {step.step}
                </div>

                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors mx-auto mt-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm leading-relaxed flex-grow">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
