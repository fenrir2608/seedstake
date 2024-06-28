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
import { ModeToggle } from "../../components/ui/mode-toggle";
import {
  HandCoins,
  ReceiptIndianRupee,
  UsersRound,
  Settings,
  Handshake,
  Search,
  ArrowLeft,
  SquarePlus
} from "lucide-react";
import { Separator } from "../../components/ui/separator";
import LoadingSkeleton from "../../components/ui/loading_skeleton";

export default function Donations() {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [donations, setDonations] = useState([]);
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [anonymousDonationsAmount, setAnonymousDonationsAmount] = useState(0);
  const [anonymousDonationsCount, setAnonymousDonationsCount] = useState(0);
  const [totalDonationsCount, setTotalDonationsCount] = useState(0);
  const [totalRaised, setTotalRaised] = useState(0);
  const [donorsList, setDonorsList] = useState([]);
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

        const {
          totalDonationsCount,
          anonymousDonationsAmount,
          anonymousDonationsCount,
          adminCampaigns,
          totalRaised,
          donorsList,
          adminUsername,
        } = data;
        setTotalDonationsCount(totalDonationsCount);
        setAnonymousDonationsAmount(anonymousDonationsAmount);
        setAnonymousDonationsCount(anonymousDonationsCount);
        setAdminCampaigns(adminCampaigns);
        setTotalRaised(totalRaised);
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
    return <div><LoadingSkeleton/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
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
                  className="cursor-pointer flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  onClick={() => navigate("/donations")}
                >
                  <ReceiptIndianRupee className="h-6 w-6" />
                  Donations
                </div>
                <div
                  className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="font-semibold text-lg md:text-xl">
                Donations
              </h1>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Raised (Anonymous)</CardTitle>
                  <CardDescription>
                    Total amount of anonymous donations received.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center text-4xl font-bold">
                    ${anonymousDonationsAmount.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Raised</CardTitle>
                  <CardDescription>
                    Total amount of donations received.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center text-4xl font-bold mt-5">
                    ${totalRaised.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Anonymous Donations</CardTitle>
                  <CardDescription>
                    Total count of anonymous donations received across all
                    campaigns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center text-4xl font-bold">
                    {anonymousDonationsCount}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Donations</CardTitle>
                  <CardDescription>
                    Total count of donations received across all campaigns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center text-4xl font-bold">
                    {totalDonationsCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {adminCampaigns.map((campaign) => (
              <section key={campaign._id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{campaign.title}</h2>
                  <div className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                   Goal: ${campaign.targetAmount}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Raised</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">
                        ${campaign.totalRaisedAmount.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground">
                        {campaign.percentageRaised.toFixed(2)}% of goal
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Anonymous Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">
                        {campaign.anonymousDonationsCountPerCampaign}
                      </div>
                      {/* <div className="text-muted-foreground">35% of total</div> */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">
                        {campaign.donationsCount}
                      </div>
                      {/* <div className="text-muted-foreground">Avg. donation amount</div> */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Donation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">${campaign.avgDonationAmount.toFixed(2)}</div>
                      <div className="text-muted-foreground">
                        Avg. donation amount
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            ))}

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                          <TableHead>% of Goal</TableHead>
                          <TableHead>Donations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminCampaigns.slice(0, 4).map((campaign) => (
                          <TableRow key={campaign._id}>
                            <TableCell>{campaign.title}</TableCell>
                            <TableCell>
                              ${campaign.totalRaisedAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {campaign.percentageRaised.toFixed(2)}%
                            </TableCell>
                            <TableCell>{campaign.donationsCount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {adminCampaigns.length >= 4 && (
                      <div
                        style={{
                          cursor: "pointer",
                          textAlign: "right",
                          marginTop: "10px",
                        }}
                      >
                        <a className="cursor-pointer" onClick={() => navigate("/campaigns")}>View More</a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Donors List</CardTitle>
                    <CardDescription>
                      List of donors who have contributed to your campaigns.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Donor Name</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {donorsList.slice(0, 4).map((donor) => (
                          <TableRow key={donor._id}>
                            <TableCell>{donor.donorName}</TableCell>
                            <TableCell>${donor.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              {new Date(
                                donor.donationDate
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {donorsList.length >= 4 && (
                      <div style={{ textAlign: "right", marginTop: "10px" }}>
                        <a className="cursor-pointer" onClick={() => navigate("/donors")}>View More</a>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
