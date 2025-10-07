import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, MessageSquare, DollarSign, ShieldCheck, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { OrderConfirmationModal } from "./OrderConfirmationModal";

interface TradeItem {
  id: string;
  name: string;
  image?: string;
  condition: string;
  value: number;
}

interface TradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otherUser: {
    name: string;
    reputation: number;
    items: TradeItem[];
  };
  currentUserItems: TradeItem[];
}

export const TradeModal = ({ open, onOpenChange, otherUser, currentUserItems }: TradeModalProps) => {
  const router = useRouter();
  const [selectedMyItems, setSelectedMyItems] = useState<string[]>([]);
  const [selectedTheirItems, setSelectedTheirItems] = useState<string[]>([]);
  const [cashCompensation, setCashCompensation] = useState(0);
  const [message, setMessage] = useState("");
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const myItemsValue = currentUserItems
    .filter(item => selectedMyItems.includes(item.id))
    .reduce((sum, item) => sum + item.value, 0);
  
  const theirItemsValue = otherUser.items
    .filter(item => selectedTheirItems.includes(item.id))
    .reduce((sum, item) => sum + item.value, 0);

  const tradeDifference = theirItemsValue - myItemsValue;

  const toggleMyItem = (id: string) => {
    setSelectedMyItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleTheirItem = (id: string) => {
    setSelectedTheirItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRequestVerification = () => {
    setVerificationRequested(!verificationRequested);
    if (!verificationRequested) {
      toast({
        title: "Verification Requested",
        description: "Both parties must accept $9.99 verification fee before proceeding.",
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (verificationRequested) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleConfirmTrade = () => {
    toast({
      title: "Trade Offer Sent!",
      description: "Your trade offer has been sent and will appear in Trades.",
    });
    
    setShowConfirmation(false);
    onOpenChange(false);
    
    // Navigate to trades page
    setTimeout(() => router.push("/trades"), 500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <ArrowLeftRight className="h-6 w-6 text-primary" />
              Trade with {otherUser.name}
            </DialogTitle>
            <DialogDescription>
              Select items to trade and negotiate the deal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Trade Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Your Items</h3>
                  <p className="text-2xl font-bold text-primary">${myItemsValue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{selectedMyItems.length} items selected</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Their Items</h3>
                  <p className="text-2xl font-bold text-accent">${theirItemsValue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{selectedTheirItems.length} items selected</p>
                </CardContent>
              </Card>
            </div>

            {/* Trade Difference */}
            {tradeDifference !== 0 && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm font-medium">
                  {tradeDifference > 0 
                    ? `You should receive $${Math.abs(tradeDifference).toFixed(2)} cash compensation`
                    : `You should offer $${Math.abs(tradeDifference).toFixed(2)} cash compensation`
                  }
                </p>
              </div>
            )}

            {/* Collections */}
            <div className="grid grid-cols-2 gap-6">
              {/* Your Collection */}
              <div className="space-y-3">
                <h3 className="font-semibold">Your Collection</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
                  {currentUserItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedMyItems.includes(item.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleMyItem(item.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.condition}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">${item.value}</p>
                          {selectedMyItems.includes(item.id) && (
                            <Badge variant="default" className="mt-1">Selected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Their Collection */}
              <div className="space-y-3">
                <h3 className="font-semibold">{otherUser.name}'s Collection</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
                  {otherUser.items.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedTheirItems.includes(item.id)
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => toggleTheirItem(item.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.condition}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">${item.value}</p>
                          {selectedTheirItems.includes(item.id) && (
                            <Badge variant="default" className="mt-1">Selected</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Options */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="cashCompensation" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cash Compensation (Optional)
                </Label>
                <Input
                  id="cashCompensation"
                  type="number"
                  placeholder="0.00"
                  value={cashCompensation || ""}
                  onChange={(e) => setCashCompensation(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message to Trader
                </Label>
                <Textarea
                  id="message"
                  placeholder="Add a message about your trade offer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Verification Option */}
              <Card className={verificationRequested ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <ShieldCheck className={`h-5 w-5 ${verificationRequested ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <h4 className="font-semibold">AbdiTrade Verification</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          $9.99 per side • Both parties must accept • Secure & verified trade
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={verificationRequested ? "default" : "outline"}
                      size="sm"
                      onClick={handleRequestVerification}
                    >
                      {verificationRequested ? "Requested" : "Request"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                className="flex-1 gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message Directly
              </Button>
              <Button 
                className="flex-1 gap-2"
                onClick={handleProceedToCheckout}
                disabled={selectedMyItems.length === 0 || selectedTheirItems.length === 0}
              >
                <ArrowLeftRight className="h-4 w-4" />
                Send Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OrderConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        transactionType="trade"
        orderDetails={{
          myItems: currentUserItems.filter(item => selectedMyItems.includes(item.id)),
          theirItems: otherUser.items.filter(item => selectedTheirItems.includes(item.id)),
          cashCompensation,
          verificationFee: verificationRequested ? 19.98 : 0,
          otherUser: otherUser.name,
        }}
        onConfirm={handleConfirmTrade}
      />
    </>
  );
};
