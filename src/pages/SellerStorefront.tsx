import { useState } from "react";
import { Palette, Eye, Save, Upload, Store } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const SellerStorefront = () => {
  const [storeName, setStoreName] = useState("Elite Cards Emporium");
  const [storeDescription, setStoreDescription] = useState("Premium trading cards from a trusted seller since 2020");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [bannerImage, setBannerImage] = useState("");
  const [logoImage, setLogoImage] = useState("");

  const handleSave = () => {
    toast({
      title: "Storefront Saved",
      description: "Your storefront theme has been updated successfully.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Opening your storefront preview in a new tab...",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Seller Storefront</h1>
              <p className="text-muted-foreground">Customize your seller profile and storefront</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="branding">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>

              <TabsContent value="branding" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>Basic details about your store</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Enter your store name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeDescription">Store Description</Label>
                      <Textarea
                        id="storeDescription"
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        placeholder="Describe your store and what makes it unique"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Store Images</CardTitle>
                    <CardDescription>Upload your logo and banner image</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Store Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                          {logoImage ? (
                            <img src={logoImage} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Banner Image</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                          {bannerImage ? (
                            <img src={bannerImage} alt="Banner" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Banner
                      </Button>
                      <p className="text-xs text-muted-foreground">Recommended: 1200x300px, PNG or JPG</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Scheme</CardTitle>
                    <CardDescription>Customize your storefront colors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="accentColor"
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            placeholder="#8b5cf6"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Preset Themes</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center gap-2"
                          onClick={() => {
                            setPrimaryColor("#3b82f6");
                            setAccentColor("#8b5cf6");
                          }}
                        >
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full bg-blue-500" />
                            <div className="w-6 h-6 rounded-full bg-purple-500" />
                          </div>
                          <span className="text-xs">Ocean</span>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center gap-2"
                          onClick={() => {
                            setPrimaryColor("#ef4444");
                            setAccentColor("#f59e0b");
                          }}
                        >
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full bg-red-500" />
                            <div className="w-6 h-6 rounded-full bg-amber-500" />
                          </div>
                          <span className="text-xs">Fire</span>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-20 flex flex-col items-center justify-center gap-2"
                          onClick={() => {
                            setPrimaryColor("#10b981");
                            setAccentColor("#06b6d4");
                          }}
                        >
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full bg-emerald-500" />
                            <div className="w-6 h-6 rounded-full bg-cyan-500" />
                          </div>
                          <span className="text-xs">Forest</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Storefront Layout</CardTitle>
                    <CardDescription>Configure how your products are displayed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Display Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-24 flex flex-col gap-2">
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-8 h-8 bg-muted rounded" />
                            <div className="w-8 h-8 bg-muted rounded" />
                            <div className="w-8 h-8 bg-muted rounded" />
                          </div>
                          <span className="text-xs">Grid View</span>
                        </Button>

                        <Button variant="outline" className="h-24 flex flex-col gap-2">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="w-full h-3 bg-muted rounded" />
                            <div className="w-full h-3 bg-muted rounded" />
                            <div className="w-full h-3 bg-muted rounded" />
                          </div>
                          <span className="text-xs">List View</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See how your storefront looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Banner Preview */}
                  <div 
                    className="w-full h-24 rounded-lg flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`
                    }}
                  >
                    {logoImage ? (
                      <img src={logoImage} alt="Logo" className="h-16 w-16 rounded-full border-2 border-white" />
                    ) : (
                      <div className="h-16 w-16 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                        <Store className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Store Info Preview */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{storeName}</h3>
                    <p className="text-sm text-muted-foreground">{storeDescription}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">1,234 Sales</Badge>
                      <Badge variant="outline">4.9★</Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Sample Product Cards */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sample Listings:</p>
                    {[1, 2].map((i) => (
                      <div key={i} className="border rounded-lg p-3 space-y-2">
                        <div 
                          className="w-full h-20 rounded"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Sample Card {i}</p>
                          <p className="text-sm" style={{ color: primaryColor }}>$99.99</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerStorefront;
