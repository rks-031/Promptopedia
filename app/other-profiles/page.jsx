"use client";
import { useState, useEffect } from "react";

const OtherProfilesPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/other-profiles");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        } else {
          console.error("Error fetching data:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Other Profiles</h1>
      <ul>
        {users?.map((user) => (
          <li key={user._id}>
            <h2>{user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Image: {user.image}</p>
            <h3>Prompts:</h3>
            <ul>
              {user.prompts?.map((prompt) => (
                <li key={prompt._id}>
                  <p>{prompt.prompt}</p>
                  <p>Tag: {prompt.tag}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OtherProfilesPage;
