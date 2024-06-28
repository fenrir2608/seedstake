import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { ModeToggle } from "../../components/ui/mode-toggle";
import { ReceiptIndianRupee, SquarePlus } from "lucide-react";

export default function NewCampaign() {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState(false);

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    image: null,
  });

  const { title, description, targetAmount, startDate, endDate, image } =
    inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((previousInputValue) => ({
      ...previousInputValue,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setInputValue((previousInputValue) => ({
      ...previousInputValue,
      image: e.target.files[0],
    }));
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-center",
      hideProgressBar: true,
      autoClose: 5000, // Extended autoClose time for better visibility
      theme: "dark",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
      hideProgressBar: true,
      autoClose: 5000, // Extended autoClose time for better visibility
      theme: "dark",
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Check if the form submit event is triggered

    if (!title || !description || !targetAmount || !startDate || !endDate) {
      handleError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("targetAmount", targetAmount);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (image) {
      formData.append("image", image);
    }

    try {
      const { data } = await axios.post("https://seedstake.onrender.com/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (data) {
        handleSuccess("Campaign created successfully!");
        navigate("/campaigns");
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      handleError("Error creating campaign.");
    }
  };

  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data: verification } = await axios.get(
          "https://seedstake.onrender.com/verify",
          {
            withCredentials: true,
          }
        );
        if (!verification.status) {
          removeCookie("token");
          navigate("/login");
          return;
        }

        const { data } = await axios.get("https://seedstake.onrender.com/", {
          withCredentials: true,
        });

        const { status, user, isAdmin } = data;
        if (status) {
          setUsername(user);
          if (isAdmin) {
            setUserStatus(isAdmin);
          }
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying cookie:", error);
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
                className="h-6 w-6 text-gray-600"
                onClick={() => navigate("/")}
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

      <Card className="w-full max-w-md mx-auto mt-16">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>
              Fill out the form to create a new fundraising campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleOnChange}
                  placeholder="Enter campaign title"
                  required // Ensure input is required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleOnChange}
                  placeholder="Describe your campaign"
                  className="min-h-[100px]"
                  required // Ensure textarea is required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    value={targetAmount}
                    onChange={handleOnChange}
                    placeholder="$0"
                    required // Ensure input is required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={startDate}
                    onChange={handleOnChange}
                    required // Ensure input is required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={endDate}
                    onChange={handleOnChange}
                    required // Ensure input is required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Campaign Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Campaign
            </Button>
          </CardFooter>
        </form>
        <ToastContainer />
      </Card>
    </>
  );
}
