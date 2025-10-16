import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { signIn, signOut, useSession } from "next-auth/react";
import { authService } from "@/services/authService";
import { userManagementService } from "@/services/userManagementService";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  
  // Sign Up State
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [userType, setUserType] = useState<'Individual' | 'TCG Store'>('Individual');
  const [storeName, setStoreName] = useState("");
  const [preferredGames, setPreferredGames] = useState<string[]>([]);
  const [wantSellerOnboarding, setWantSellerOnboarding] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Email Verification State
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Show immediate loading feedback for better UX
      toast({
        title: "Signing in...",
        description: "Please wait a moment.",
      });
      
      // Use NextAuth credentials provider for email/password
      const result = await signIn('credentials', {
        email: signInEmail,
        password: signInPassword,
        redirect: false, // Handle redirect manually for better control
      });
      
      if (result?.error) {
        setIsLoading(false);
        throw new Error(result.error);
      }
      
      if (result?.ok) {
        // Show success message
        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard...",
        });
        
        // Force immediate redirect to dashboard
        router.replace('/dashboard');
        return; // Exit early to prevent loading state change
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false); // Only set loading false on error
    }
    // Don't set loading false on success to maintain loading state during redirect
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // All users need email verification, company emails get special roles
      const isCompanyEmail = userManagementService.isCompanyEmail(signUpEmail);
      
      const result = await authService.signUp(
        signUpEmail, 
        signUpPassword, 
        {
          firstName: signUpFirstName,
          lastName: signUpLastName,
          username: signUpUsername,
          userType: userType,
          storeName: userType === 'TCG Store' ? storeName : undefined,
          preferredGames: preferredGames
        }
      );
      
      // ALL users need email verification, regardless of email domain
      
      if (result.needsVerification) {
        setPendingEmail(signUpEmail);
        setShowEmailVerification(true);
        toast({
          title: "Check your email!",
          description: "We've sent you a verification code to complete your registration.",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
        
        // Redirect based on user's preference
        if (wantSellerOnboarding) {
          router.push("/seller-onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
      setError(errorMessage);
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    setShowEmailVerification(false);
    toast({
      title: "Email verified!",
      description: "Your account is now active. Welcome to Abditrade!",
    });
    
    // Redirect based on user's preference for seller onboarding
    if (wantSellerOnboarding) {
      router.push("/seller-onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  const handleBackToSignUp = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
  };

  const passwordRequirements = [
    "At least 8 characters",
    "At least one uppercase letter",
    "At least one lowercase letter",
    "At least one number",
    "At least one special character (!@#$%^&*)",
  ];

  // Show email verification if needed
  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="max-w-md mx-auto">
            <EmailVerification
              email={pendingEmail}
              onVerificationComplete={handleVerificationComplete}
              onBackToSignUp={handleBackToSignUp}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to start trading cards with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4" variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="marquise.williams@abditrade.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          required
                          className="bg-secondary/50 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      <Link 
                        href="/auth/forgot-password" 
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full h-12 text-base font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    {/* Social Login Options */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-gray-500 font-medium">Or</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-gray-300"
                        onClick={() => {
                          setIsLoading(true);
                          signIn('google', { callbackUrl: '/dashboard' });
                        }}
                        disabled={isLoading}
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        {isLoading ? "Connecting..." : "Continue with Google"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">Join Abditrade</CardTitle>
                  <CardDescription>
                    Create your account and set up your trading preferences later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4" variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstname">First Name</Label>
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="First name"
                          value={signUpFirstName}
                          onChange={(e) => setSignUpFirstName(e.target.value)}
                          required
                          className="bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastname">Last Name</Label>
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder="Last name"
                          value={signUpLastName}
                          onChange={(e) => setSignUpLastName(e.target.value)}
                          required
                          className="bg-secondary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Choose a unique username"
                        value={signUpUsername}
                        onChange={(e) => setSignUpUsername(e.target.value)}
                        required
                        className="bg-secondary/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be your display name in guilds and posts
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="marquise.williams@abditrade.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                        className="bg-secondary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          required
                          className="bg-secondary/50 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1 pt-2">
                        <p className="font-medium">Password must contain:</p>
                        <ul className="space-y-0.5 pl-4">
                          {passwordRequirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* User Type Selection */}
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Select value={userType} onValueChange={(value: 'Individual' | 'TCG Store') => setUserType(value)}>
                        <SelectTrigger className="bg-secondary/50">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual">Individual Trader</SelectItem>
                          <SelectItem value="TCG Store">TCG Store/Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Store Name (if TCG Store is selected) */}
                    {userType === 'TCG Store' && (
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input
                          id="store-name"
                          type="text"
                          placeholder="Enter your store name"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          required
                          className="bg-secondary/50"
                        />
                      </div>
                    )}

                    {/* Preferred Card Games */}
                    <div className="space-y-2">
                      <Label>Preferred Card Games (Optional)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Dragon Ball Super',
                          'One Piece', 'Digimon', 'Gundam', 'Union Arena'
                        ].map((game) => (
                          <div key={game} className="flex items-center space-x-2">
                            <Checkbox
                              id={`game-${game}`}
                              checked={preferredGames.includes(game)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPreferredGames([...preferredGames, game]);
                                } else {
                                  setPreferredGames(preferredGames.filter(g => g !== game));
                                }
                              }}
                            />
                            <Label htmlFor={`game-${game}`} className="text-sm font-normal cursor-pointer">
                              {game}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="accept-terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-0.5"
                      />
                      <label htmlFor="accept-terms" className="text-sm text-muted-foreground leading-5 cursor-pointer">
                        I agree to Abditrade's{" "}
                        <Link href="/terms" className="text-primary hover:underline font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline font-medium">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    {/* Seller Onboarding Option */}
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="seller-onboarding" 
                        checked={wantSellerOnboarding}
                        onCheckedChange={(checked) => setWantSellerOnboarding(checked as boolean)}
                        className="mt-0.5"
                      />
                      <label htmlFor="seller-onboarding" className="text-sm text-muted-foreground leading-5 cursor-pointer">
                        I want to start selling cards immediately after registration{" "}
                        <span className="text-primary font-medium">(Seller Onboarding)</span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full h-12 text-base font-medium"
                      disabled={isLoading || !acceptTerms}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>

                    {/* Social Sign-up Options */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-gray-500 font-medium">Or</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-gray-300"
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        disabled={isLoading}
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Sign up with Google
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 text-base font-medium border-gray-300"
                        onClick={() => signIn('cognito', { callbackUrl: '/dashboard' })}
                        disabled={isLoading}
                      >
                        Sign up with AWS
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;

