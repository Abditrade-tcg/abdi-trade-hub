import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingOption?: "standard" | "processing";
  onConfirm?: () => void;
}

export const CheckoutModal = ({ open, onOpenChange, items, shippingOption = "standard", onConfirm }: CheckoutModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const processingFee = shippingOption === "processing" ? subtotal * 0.04 : 0;
  const shipping = shippingOption === "standard" ? 9.99 : 0;
  const total = subtotal + processingFee + shipping;

  const handleCheckout = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed and will be tracked in Orders.",
    });
    
    onConfirm?.();
    onOpenChange(false);
    setLoading(false);
    
    // Navigate to orders page
    setTimeout(() => navigate("/orders"), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Checkout
          </DialogTitle>
          <DialogDescription>
            Complete your purchase securely with Stripe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Summary
            </h3>
            <div className="border border-border rounded-lg p-4 space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {shippingOption === "processing" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee (4%)</span>
                    <span>${processingFee.toFixed(2)}</span>
                  </div>
                )}
                {shippingOption === "standard" && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Shipping
                    </span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payment Method</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input 
                    id="cvc" 
                    placeholder="123" 
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shipping Address</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" className="mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 gap-2" 
              onClick={handleCheckout}
              disabled={loading}
            >
              <CreditCard className="h-4 w-4" />
              {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Payments secured by Stripe Connect • Your card details are encrypted
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
