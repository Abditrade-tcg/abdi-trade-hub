import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  Users,
  Shield,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Crown,
  Building2,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { userManagementService, UserProfile, UserRole, UserGroup } from "@/services/userManagementService";
import { toast } from "@/hooks/use-toast";

const HR = () => {
  const { data: session, status } = useSession() || { data: null, status: 'loading' };
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    group: ""
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [availableGroups, setAvailableGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if user has HR permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        const profile = await userManagementService.getUserProfile(session.user.email);
        if (!profile || !userManagementService.hasPermission(profile, 'view_hr_dashboard')) {
          router.push('/dashboard');
          return;
        }
      } else if (status === 'unauthenticated') {
        router.push('/auth?callbackUrl=/hr');
        return;
      }
    };

    checkPermissions();
  }, [status, session, router]);

  // Load available roles and groups
  useEffect(() => {
    setAvailableRoles(userManagementService.getAllRoles());
    setAvailableGroups(userManagementService.getAllGroups());
  }, []);

  const employees = [
    { id: "1", name: "Admin User", email: "admin@abditrade.com", role: "CEO", group: "admins", status: "Active" },
    { id: "2", name: "Finance Manager", email: "finance@abditrade.com", role: "CFO", group: "employees", status: "Active" },
    { id: "3", name: "HR Manager", email: "hr@abditrade.com", role: "HR", group: "employees", status: "Active" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New employee:", formData);
    // TODO: Implement employee creation with Cognito integration
    toast({
      title: "Employee Added",
      description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
    });
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select both a user and a role.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await userManagementService.assignRole(selectedUser, selectedRole);
      if (success) {
        toast({
          title: "Role Assigned",
          description: `Role has been successfully assigned to the user.`,
        });
        setSelectedUser("");
        setSelectedRole("");
      } else {
        throw new Error("Failed to assign role");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGroup = async () => {
    if (!selectedUser || !selectedGroup) {
      toast({
        title: "Error",
        description: "Please select both a user and a group.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await userManagementService.addUserToGroup(selectedUser, selectedGroup);
      if (success) {
        toast({
          title: "User Added to Group",
          description: `User has been successfully added to the group.`,
        });
        setSelectedUser("");
        setSelectedGroup("");
      } else {
        throw new Error("Failed to add user to group");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user to group. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking permissions
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading HR Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              HR Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Employee management and onboarding</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Employee */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Add New Employee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@abditrade.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Access Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="cfo">CFO</SelectItem>
                      <SelectItem value="hr">HR Manager</SelectItem>
                      <SelectItem value="trust_safety">Trust & Safety</SelectItem>
                      <SelectItem value="order_management">Order Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Operations"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Employees */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Current Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary">{employee.role}</Badge>
                      <Badge variant="outline" className="gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role and Group Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assign Role */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                Assign Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose user to assign role" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose role to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{role.name}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAssignRole} 
                disabled={loading || !selectedUser || !selectedRole}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Assign Role
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Add to Group */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Add to Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose user to add to group" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Group</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose group to join" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{group.name}</span>
                          <span className="text-xs text-muted-foreground">{group.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddToGroup} 
                disabled={loading || !selectedUser || !selectedGroup}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Add to Group
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Role & Group Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Roles */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Available Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableRoles.map((role) => (
                  <div key={role.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role.name}</h4>
                      <Badge variant="outline">{role.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Groups */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableGroups.map((group) => (
                  <div key={group.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{group.name}</h4>
                      <Badge variant="outline">{group.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {group.roles.map((roleId) => (
                        <Badge key={roleId} variant="secondary" className="text-xs">
                          {roleId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HR;

