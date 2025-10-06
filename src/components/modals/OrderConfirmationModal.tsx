import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ShieldCheck, Package } from "lucide-react";
import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

interface OrderConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionType: "buy" | "sell" | "trade";
  orderDetails: {
    myItems?: Array<{ name: string; value: number; condition: string }>;
    theirItems?: Array<{ name: string; value: number; condition: string }>;
    cashCompensation?: number;
    verificationFee?: number;
    otherUser?: string;
    items?: Array<{ name: string; price: number; quantity: number }>;
    total?: number;
  };
  onConfirm?: () => void;
}

export const OrderConfirmationModal = ({ 
  open, 
  onOpenChange, 
  transactionType,
  orderDetails,
  onConfirm 
}: OrderConfirmationModalProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [acknowledgedLiability, setAcknowledgedLiability] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const hasVerification = orderDetails.verificationFee && orderDetails.verificationFee > 0;

  const handleConfirm = () => {
    if (hasVerification || transactionType === "buy") {
      // Show checkout modal for payments
      onOpenChange(false);
      setShowCheckout(true);
    } else {
      // Direct confirmation for non-payment trades
      onConfirm?.();
      onOpenChange(false);
    }
  };

  const getTotalAmount = () => {
    if (transactionType === "buy" && orderDetails.total) {
      return orderDetails.total;
    }
    if (transactionType === "trade") {
      return (orderDetails.cashCompensation || 0) + (orderDetails.verificationFee || 0);
    }
    return 0;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Confirm Your {transactionType === "trade" ? "Trade" : "Order"}
            </DialogTitle>
            <DialogDescription>
              Please review all details before confirming
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Transaction Summary */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Transaction Type</h3>
                  <Badge variant="default" className="capitalize">{transactionType}</Badge>
                </div>

                <Separator />

                {transactionType === "trade" && (
                  <>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">You're Trading:</p>
                        <div className="space-y-1">
                          {orderDetails.myItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.name} ({item.condition})</span>
                              <span className="font-medium">${item.value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">You're Receiving from {orderDetails.otherUser}:</p>
                        <div className="space-y-1">
                          {orderDetails.theirItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.name} ({item.condition})</span>
                              <span className="font-medium">${item.value.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {orderDetails.cashCompensation !== undefined && orderDetails.cashCompensation > 0 && (
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Cash Compensation</span>
                            <span className="text-sm font-bold">${orderDetails.cashCompensation.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />
                  </>
                )}

                {transactionType === "buy" && orderDetails.items && (
                  <>
                    <div className="space-y-2">
                      {orderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <Separator />
                  </>
                )}

                {/* Verification Fee */}
                {hasVerification && (
                  <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AbdiTrade Verification</span>
                    </div>
                    <span className="font-semibold">${orderDetails.verificationFee?.toFixed(2)}</span>
                  </div>
                )}

                {/* Total */}
                {getTotalAmount() > 0 && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">Total Amount Due</span>
                    <span className="text-2xl font-bold text-primary">${getTotalAmount().toFixed(2)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Terms & Conditions</h3>
                
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the AbdiTrade <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Community Guidelines</span>. I confirm that all information provided is accurate and I will fulfill my obligations in this transaction.
                  </label>
                </div>

                {!hasVerification && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          id="liability" 
                          checked={acknowledgedLiability}
                          onCheckedChange={(checked) => setAcknowledgedLiability(checked === true)}
                        />
                        <label htmlFor="liability" className="text-sm leading-relaxed cursor-pointer">
                          <span className="font-semibold">Liability Waiver:</span> By not selecting AbdiTrade Verification, I acknowledge that I am waiving platform protection and liability coverage. I understand that disputes may be harder to resolve and I proceed at my own risk.
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {hasVerification && (
                  <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Protected Transaction</p>
                      <p className="text-muted-foreground">
                        This transaction is protected by AbdiTrade Verification. Both parties are covered by our dispute resolution process and buyer/seller protection policies.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 gap-2" 
                onClick={handleConfirm}
                disabled={!agreedToTerms || (!hasVerification && !acknowledgedLiability)}
              >
                <CheckCircle2 className="h-4 w-4" />
                {getTotalAmount() > 0 ? "Proceed to Payment" : "Confirm Trade"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {(hasVerification || transactionType === "buy") && (
        <CheckoutModal
          open={showCheckout}
          onOpenChange={setShowCheckout}
          items={
            transactionType === "buy" && orderDetails.items
              ? orderDetails.items
              : [{ name: "Trade Transaction", price: getTotalAmount(), quantity: 1 }]
          }
          shippingOption={hasVerification ? "processing" : "standard"}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};
