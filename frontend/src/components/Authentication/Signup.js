import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Select } from "@chakra-ui/react";
import { React, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router";
import { ChatState } from "../../Context/ChatProvider";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setUser } = ChatState();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleSignupClick = () => {
    const signInContainer = document.getElementsByClassName('sign-in-container');
    const signUpContainer = document.getElementsByClassName('sign-up-container');
    if (signInContainer && signUpContainer) {
      signInContainer[0].style.display = 'block';
      signUpContainer[0].style.display = 'none';
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (!pics) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "wzeukzpi");
      data.append("cloud_name", "dqdpwdoxs");

      axios.post("https://api.cloudinary.com/v1_1/dqdpwdoxs/image/upload", data)
        .then((response) => {
          setPic(response.data.url.toString());
          setPicLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const handleSubmit = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmPassword || !language) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const userData = {
        name: name,
        email: email,
        password: password,
        pic: pic,
        lang: language,
      };

      const response = await axios.post("/api/user", userData, config);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const languages = [
    { code: "EN", name: "English" },
    { code: "FR", name: "French" },
    { code: "ES", name: "Spanish" },
    { code: "DE", name: "German" },
    { code: "IT", name: "Italian" },
    { code: "PT", name: "Portuguese" },
    { code: "RU", name: "Russian" },
    { code: "ZH", name: "Chinese" },
    { code: "JA", name: "Japanese" },
    { code: "KO", name: "Korean" },
  ];

  return (
    <div className="data-form">
      <h1>Create Account</h1>

      <span>or use your email for registration</span>
      <Input
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Enter Your Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Select
        placeholder="Select your language"
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </Select>
      <input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
      />
      <Button onClick={handleSubmit}
        isLoading={picLoading}>Sign Up</Button>
      <button class="create-account" onClick={handleSignupClick}
      >Login In</button>
    </div>
  );
};

export default Signup;
