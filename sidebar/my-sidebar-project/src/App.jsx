import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";

const App = () => {


  const [input, setInput] = useState({
    email:"",
    password:"",
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);
    const response = await axios.post(
      `http://localhost:6080/api/v1/user/login`,
      input,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log(response);
  };

  const handleLogout = async () => {
    const response = await axios.get(
      `http://localhost:6080/api/v1/user/logout`,
      {
        withCredentials: true,
      }
    );

    console.log("logout", response);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="email" name="email" value={input.email} onChange={handleChange} />
        <input type="password" placeholder="password" name="password" value={input.password} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default App;
