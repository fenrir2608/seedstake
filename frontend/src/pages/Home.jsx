import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../../components/ui/button";
import { ModeToggle } from "../../components/ui/mode-toggle";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Progress } from "../../components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { ReceiptIndianRupee, SquarePlus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [campaigns, setCampaigns] = useState("");
  const [aCampaigns, setACampaigns] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [userStatus, setUserStatus] = useState(false);

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data: verification } = await axios.get(
          "http://localhost:3000/verify",
          {
            withCredentials: true,
          }
        );
        if (!verification.status) {
          removeCookie("token");
          navigate("/login");
          return;
        }

        const { data } = await axios.get("http://localhost:3000/", {
          withCredentials: true,
        });

        const { status, user, isAdmin, adminCampaigns, allCampaigns } = data;
        if (status) {
          setUsername(user);
          setCampaigns(allCampaigns);
          if (isAdmin) {
            setUserStatus(isAdmin);
            setACampaigns(adminCampaigns);
          }
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("There was an error verifying the cookie:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyCookie();
  }, [cookies.token, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
  const openModal = async (campaign) => {
    setSelectedCampaign(campaign);
    await checkOwnership(campaign._id);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setIsOwner(false);
  };

  const checkOwnership = async (campaignId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/campaigns/${campaignId}/isOwner`,
        {
          withCredentials: true,
        }
      );
      setIsOwner(data.isOwner);
    } catch (error) {
      console.error("There was an error checking campaign ownership:", error);
    }
  };

  const handleDonate = (id) => {
    navigate(`/donate/${id}`);
  };
  const calcPerc = (campaign) => {
    const percentage = (campaign.amountRaised / campaign.targetAmount) * 100;
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b-2   ">
        <span
          className="text-lg font-medium cursor-pointer"
          onClick={() => navigate("/")}
        >
          SeedStake
        </span>
        <div className="flex items-center gap-4">
          {userStatus ? (
            <>
              <SquarePlus
                className="h-6 w-6 text-gray-400"
                onClick={() => navigate("/new")}
              />
              <ReceiptIndianRupee
                className="h-6 w-6 text-gray-400"
                onClick={() => navigate("/donations")}
              />
            </>
          ) : (
            <div />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border w-8 h-8"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
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
        </div>
      </header>

      <div className="home_page">
        <div className="w-full py-10 lg:py-20">
          <div className="container mx-auto">
            <div className="flex flex-col gap-10">
              <div className="flex gap-4 flex-col items-start">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                    Welcome {username}
                  </h2>
                  <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                    Explore Campaigns and earn your stake.
                  </p>
                </div>
              </div>
              {userStatus ? (
                aCampaigns.length > 0 ? (
                  <div>
                    <Badge>My Campaigns</Badge>
                  </div>
                ) : (
                  <div>
                    <section className="w-full py-10 md:py-22 lg:py-30 bg-muted rounded-xl">
                      <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-semibold tracking-tighter sm:text-5xl">
                              Create Your First Campaign
                            </h2>
                            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                              Start gaining support by a wide community today by
                              creating a campaign for free on SeedStake!
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )
              ) : (
                <div>
                  <section className="w-full py-10 md:py-22 lg:py-30 bg-muted rounded-xl">
                    <div className="container px-4 md:px-6">
                      <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-semibold tracking-tighter sm:text-5xl">
                            Donate to your favourite campaigns now!
                          </h2>
                          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Start earning stakes today by donating to a campaign
                            with no extra charges on SeedStake!
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {aCampaigns.length > 0 ? (
                  aCampaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      onClick={() => {
                        openModal(campaign);
                        calcPerc(campaign);
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <img
                            className="object-cover bg-muted rounded-md aspect-video mb-2"
                            src={campaign.image}
                            alt="No image Available"
                          />
                        </div>
                        <h3 className="text-xl tracking-tight">
                          {campaign.user}
                          {campaign.title}
                        </h3>
                        <p className="text-muted-foreground text-base">
                          {campaign.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Campaigns */}

        <div className="w-full py-10 lg:py-20">
          <div className="container mx-auto">
            <div className="flex flex-col gap-10">
              <div className="flex gap-4 flex-col items-start">
                <div>
                  <Badge>All Campaigns</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <div
                      key={campaign._id}
                      onClick={() => {
                        openModal(campaign);
                        calcPerc(campaign);
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <img
                            className="object-cover bg-muted rounded-md aspect-video mb-2"
                            src={campaign.image}
                            alt="No image Available"
                          />
                        </div>
                        <h3 className="text-xl tracking-tight">
                          {campaign.title}
                        </h3>
                        <p className="text-muted-foreground text-base">
                          {campaign.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}

      {selectedCampaign && (
        <Dialog open={Boolean(selectedCampaign)} onOpenChange={closeModal}>
          <DialogTrigger asChild>
            <Button variant="outline">Open Modal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{selectedCampaign.title}</DialogTitle>
                  <DialogDescription>
                    {selectedCampaign.description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Fundraising Goal</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span>Target: ${selectedCampaign.targetAmount}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Raised: ${selectedCampaign.amountRaised}</span>
                    </div>
                  </div>
                  <Progress value={progress} />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${selectedCampaign.amountRaised}</span>
                    <span>${selectedCampaign.targetAmount}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How You Can Help</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span>
                        {/* <p>Target: ${campaign.targetAmount}</p>
      <p>Raised: ${campaign.amountRaised}</p>
      <p>Location: {campaign.campaignInfo.location}</p>
      <div>
      {Object.entries(campaign.campaignInfo).map(([key, value]) => (
        <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>
      ))}
      <br/><br/>  
    </div> */}
                        Your donation can provide essential supplies, shelter,
                        and support to those in need.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src={selectedCampaign.image}
                  alt={selectedCampaign.title}
                  width={600}
                  height={600}
                  className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              {isOwner ? (
                <Button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate(`/donations`)}
                >
                  Manage
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => handleDonate(selectedCampaign._id)}
                >
                  Donate
                </Button>
              )}
              <Button
                className="hidden sm:block"
                type="button"
                onClick={closeModal}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <ToastContainer />
    </>
  );
};

export default Home;
