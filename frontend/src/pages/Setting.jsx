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
  CardFooter,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { ModeToggle } from "../../components/ui/mode-toggle";
import {
  HandCoins,
  ReceiptIndianRupee,
  UsersRound,
  Settings,
  Handshake,
  Search,
  ArrowLeft,
  SquarePlus,
} from "lucide-react";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import LoadingSkeleton from "../../components/ui/loading_skeleton";

export default function Setting() {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [anonymousDonationsAmount, setAnonymousDonationsAmount] = useState(0);
  const [donorsList, setDonorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("https://seedstake.onrender.com/donations", {
          withCredentials: true,
        });

        const {
          anonymousDonationsAmount,
          adminCampaigns,
          totalRaised,
          donorsList,
          adminUsername,
        } = data;
        setAnonymousDonationsAmount(anonymousDonationsAmount);
        setAdminCampaigns(adminCampaigns);
        //setTotalRaised(totalRaised);
        setDonorsList(donorsList);
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
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <div className="flex items-center gap-2 font-semibold">
              <HandCoins className="h-8 w-8" />
              <span className="text-lg">Donation Dashboard</span>
            </div>
          </div>
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
                className="cursor-pointer flex items-center gap-3 rounded-lg text-muted-foreground px-3 py-2 transition-all hover:text-primary"
                onClick={() => navigate("/campaigns")}
              >
                <Handshake className="h-6 w-6" />
                Campaigns
              </div>
              <div
                className="cursor-pointer flex items-center gap-3 rounded-lg text-muted-foreground px-3 py-2 transition-all hover:text-primary"
                onClick={() => navigate("/donors")}
              >
                <UsersRound className="h-6 w-6" />
                Donors
              </div>
              <div
                className="cursor-pointer flex items-center gap-3 rounded-lg bg-muted px-3 py-2 transition-all hover:text-primary"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-6 w-6" />
                Settings
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <div className="lg:hidden">
            <HandCoins className="h-6 w-6" />
            <span className="sr-only">Donation Dashboard</span>
          </div>
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
            className="h-6 w-6 text-gray-600"
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate(-1)} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="font-semibold text-lg md:text-xl">Settings</h1>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Manage your general account settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">
                        Choose a light or dark theme.
                      </p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Font Size</p>
                      <p className="text-sm text-muted-foreground">
                        Adjust the font size of the dashboard.
                      </p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Currency</p>
                      <p className="text-sm text-muted-foreground">
                        Choose the currency for your donations.
                      </p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                        <SelectItem value="cad">CAD</SelectItem>
                        <SelectItem value="aud">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
