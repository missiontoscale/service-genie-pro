import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    businessType: "",
    industryFocus: "",
    monthlyVolume: "",
    primaryGoal: "",
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Welcome to QuoteFlow AI</CardTitle>
          </div>
          <CardDescription>
            Let's personalize your experience (Step {step} of 3)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">What type of business do you run?</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                >
                  <SelectTrigger id="businessType">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelancer">Freelancer / Consultant</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="small-business">Small Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industryFocus">What industry do you work in?</Label>
                <Input
                  id="industryFocus"
                  placeholder="e.g., Software Development, Design, Marketing"
                  value={formData.industryFocus}
                  onChange={(e) => setFormData({ ...formData, industryFocus: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyVolume">How many quotes/invoices do you send monthly?</Label>
                <Select
                  value={formData.monthlyVolume}
                  onValueChange={(value) => setFormData({ ...formData, monthlyVolume: value })}
                >
                  <SelectTrigger id="monthlyVolume">
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-100">51-100</SelectItem>
                    <SelectItem value="100+">100+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryGoal">What's your primary goal with QuoteFlow AI?</Label>
                <Textarea
                  id="primaryGoal"
                  placeholder="e.g., Save time creating quotes, Track invoices better, Automate my workflow..."
                  rows={4}
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                />
              </div>
              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                />
                <label
                  htmlFor="privacy"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                    Privacy Policy
                  </Link>{" "}
                  and Terms of Service
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={step === 3 && !agreedToPrivacy}
            >
              {step === 3 ? "Get Started" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
