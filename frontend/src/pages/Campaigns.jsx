import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useCookies } from "react-cookie";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { ModeToggle } from "../../components/ui/mode-toggle";
import {
  HandCoins,
  ReceiptIndianRupee,
  UsersRound,
  Settings,
  Handshake,
  Search,
  ArrowLeft,
  Trash,
  SquarePlus
} from "lucide-react";
import LoadingSkeleton from "../../components/ui/loading_skeleton";

export default function Campaigns() {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/donations", {
          withCredentials: true,
        });

        const { adminCampaigns, adminUsername } = data;
        setAdminCampaigns(adminCampaigns);
        setUsername(adminUsername);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await axios.delete(`http://localhost:3000/campaigns/${campaignId}`, {
        withCredentials: true,
      });

      // Remove the deleted campaign from the state
      setAdminCampaigns(
        adminCampaigns.filter((campaign) => campaign._id !== campaignId)
      );
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Sidebar Header */}
          <div className="flex h-[60px] items-center border-b px-6">
            <div className="flex items-center gap-2 font-semibold">
              <HandCoins className="h-8 w-8" />
              <span className="text-lg">Donation Dashboard</span>
            </div>
          </div>
          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <div
                className="cursor-pointer flex items-center gap-3 rounded-lg text-muted-foreground px-3 py-2 transition-all hover:text-primary"
                onClick={() => navigate("/donations")}
              >
                <ReceiptIndianRupee className="h-6 w-6" />
                Donations
              </div>
              <div
                className="cursor-pointer flex items-center gap-3 rounded-lg bg-muted px-3 py-2 transition-all hover:text-primary"
                onClick={() => navigate("/campaigns")}
              >
                <Handshake className="h-6 w-6" />
                Campaigns
              </div>
              <div
                className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => navigate("/donors")}
              >
                <UsersRound className="h-6 w-6" />
                Donors
              </div>
              <div
                className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-6 w-6" />
                Settings
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            <HandCoins className="h-6 w-6" />
            <span className="sr-only">Donation Dashboard</span>
          </div>
          {/* Search Input */}
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <SquarePlus
            className="h-6 w-6 text-gray-400"
            onClick={() => navigate("/new")}
          />
          <ReceiptIndianRupee
            className="h-6 w-6 text-gray-600 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border w-8 h-8"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{username.charAt(1)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ModeToggle />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* Main Content Area */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Page Title and Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="font-semibold text-lg md:text-xl">Campaigns</h1>
          </div>
          {/* Campaign Statistics Card */}
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Donation Statistics</CardTitle>
                <CardDescription>
                  Overview of donation statistics for each campaign.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Total Raised</TableHead>
                      <TableHead>Goal</TableHead>
                      <TableHead>% of Goal</TableHead>
                      <TableHead>Donations</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminCampaigns.map((campaign) => (
                      <TableRow key={campaign._id}>
                        <TableCell>{campaign.title}</TableCell>
                        <TableCell>
                          ${campaign.totalRaisedAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>${campaign.targetAmount}</TableCell>
                        <TableCell>
                          {campaign.percentageRaised.toFixed(2)}%
                        </TableCell>
                        <TableCell>{campaign.donationsCount}</TableCell>
                        <TableCell>
                          {/* Delete Button with Confirmation Dialog */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="h-8 w-12"
                                variant="destructive"
                              >
                                <Trash className="h-6 w-6" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the selected campaign:{" "}
                                  {campaign.title}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-800"
                                  onClick={() =>
                                    handleDeleteCampaign(campaign._id)
                                  }
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
