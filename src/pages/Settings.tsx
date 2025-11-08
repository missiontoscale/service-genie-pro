import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, LogOut, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ImageCropper from "@/components/ImageCropper";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteReasonDialog, setShowDeleteReasonDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    business_name: "",
    business_email: "",
    business_address: "",
    location: "",
    company_logo: "",
  });

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    
    fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          business_name: data.business_name || "",
          business_email: data.business_email || "",
          business_address: data.business_address || "",
          location: data.location || "",
          company_logo: data.company_logo || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show cropper with the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);

    // Reset the input
    e.target.value = "";
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    setShowCropper(false);
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const filePath = `${user.id}/logo.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('user-logos')
        .upload(filePath, croppedImage, { upsert: true });

      if (uploadError) throw uploadError;

      // Add timestamp to force refresh
      const { data: { publicUrl } } = supabase.storage
        .from('user-logos')
        .getPublicUrl(filePath);

      setProfile({ ...profile, company_logo: `${publicUrl}?t=${Date.now()}` });

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("user_profiles")
          .update({
            ...profile,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            ...profile,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteDialog(false);
    setShowDeleteReasonDialog(true);
  };

  const confirmDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete user data (cascade will handle related records)
      const { error: profileError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", user.id);

      if (profileError) console.error("Profile deletion error:", profileError);

      // Delete quotes
      const { error: quotesError } = await supabase
        .from("quotes")
        .delete()
        .eq("user_id", user.id);

      if (quotesError) console.error("Quotes deletion error:", quotesError);

      // Delete invoices
      const { error: invoicesError } = await supabase
        .from("invoices")
        .delete()
        .eq("user_id", user.id);

      if (invoicesError) console.error("Invoices deletion error:", invoicesError);

      // Delete auth user (requires admin API - show message instead)
      toast({
        title: "Thank you for using Quotla!",
        description: "Your account data has been removed. Please contact support to complete account deletion.",
      });

      // Sign out
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setDeletingAccount(false);
      setShowDeleteReasonDialog(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight">Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your business profile and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                This information will appear on your quotes and invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                {profile.company_logo && (
                  <img 
                    src={profile.company_logo} 
                    alt="Company logo" 
                    className="h-20 w-20 object-contain rounded-lg border border-border"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG or WEBP (max 2MB)
                  </p>
                </div>
                {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={profile.business_name}
                  onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="business_email">Business Email</Label>
                <Input
                  id="business_email"
                  type="email"
                  value={profile.business_email}
                  onChange={(e) => setProfile({ ...profile, business_email: e.target.value })}
                  placeholder="contact@acme.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Lagos, Nigeria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_address">Business Address</Label>
              <Textarea
                id="business_address"
                value={profile.business_address}
                onChange={(e) => setProfile({ ...profile, business_address: e.target.value })}
                placeholder="123 Business Street, City, Country"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="w-full gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Delete Account Confirmation Dialog */}
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-3xl mb-2">Quotla is sad 😢</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Do you really want to delete your account? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2 justify-center">
          <AlertDialogCancel className="mt-0">No</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Delete Reason Dialog */}
    <AlertDialog open={showDeleteReasonDialog} onOpenChange={setShowDeleteReasonDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Tell us why you're leaving</AlertDialogTitle>
          <AlertDialogDescription>
            Your feedback helps us improve Quotla for everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          placeholder="Why are you deleting your account? (optional)"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          rows={4}
          className="my-4"
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletingAccount}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteAccount}
            disabled={deletingAccount}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deletingAccount ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Image Cropper */}
    {imageToCrop && (
      <ImageCropper
        image={imageToCrop}
        isOpen={showCropper}
        onCropComplete={handleCropComplete}
        onClose={() => setShowCropper(false)}
      />
    )}
  </>
  );
};

export default Settings;
