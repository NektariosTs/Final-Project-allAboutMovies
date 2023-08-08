import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { createUser } from "../../api/auth";
import { useNotification } from "../../hooks";
import { useAuth } from "../../hooks";
import { useEffect } from "react";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ name, email, password }) => {
  // regular expression is to valid name or invalid name (for example if i will put numbers inside the name is invalid if i put only letters is valid).same with the email
  const isValidName = /^[a-z A-Z]+$/;

  // statements for the userInfo information if is valid we ok or if its not valid we had an error
  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid name!" };

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters at least!" };
  return { ok: true };
};

// form signIn component for cleaner code
export default function SignUp() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const {isLoggedIn} = authInfo;

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // did not "reload the page"
    const { ok, error } = validateUserInfo(userInfo); //variables with the ok and error messages in userInfo

    if (!ok) return updateNotification("error", error); //if its not ok the info return the error

    const response = await createUser(userInfo);
    if (response.error) return console.log(response.error);

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true, //replacing the previous history
    });
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/"); //we want to move our user to somewhere else
  }, [isLoggedIn]);

  const { name, email, password } = userInfo;

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign up </Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Name"
            placeholder="Name value"
            name="name"
          />
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="Email address"
            name="email"
          />
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
            name="password"
            type="password"
          />
          <Submit value="Sign up" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signIn">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
