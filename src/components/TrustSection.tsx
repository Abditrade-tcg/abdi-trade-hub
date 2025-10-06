import { Shield, Lock, BadgeCheck, HeadphonesIcon } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Buyer Protection",
    description: "Every purchase is protected with our money-back guarantee.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Bank-level encryption keeps your payment information safe.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Sellers",
    description: "All sellers are verified to ensure authentic cards and reliable service.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our dedicated support team is here to help anytime you need us.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Trade with{" "}
            <span className="bg-gradient-to-r from-[hsl(221,83%,32%)] to-[hsl(221,83%,50%)] bg-clip-text text-transparent">
              Confidence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your security and satisfaction are our top priorities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_hsl(263,70%,50%,0.3)]">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
