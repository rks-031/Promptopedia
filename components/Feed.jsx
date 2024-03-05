"use client";
import React, { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    // Sort the posts by createdAt in descending order
    const sortedPosts = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setAllPosts(sortedPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");
    return allPosts.filter(
      (item) =>
        (item.creator && regex.test(item.creator.username)) ||
        regex.test(item.tag) ||
        (item.prompts &&
          item.prompts.some((prompt) => regex.test(prompt.prompt)))
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clearTimeout(searchTimeout);
      setSearchTimeout(
        setTimeout(() => {
          const searchResult = filterPrompts(searchText);
          setSearchedResults(searchResult);
        }, 500)
      );
    }
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form
        className="relative w-full flex-center"
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      >
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown} // Call handleKeyDown on key press
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      <div className="mt-16 prompt_layout">
        {searchedResults.length > 0
          ? searchedResults.map((post) => (
              <PromptCard
                key={post._id}
                post={post}
                handleTagClick={handleTagClick}
              />
            ))
          : allPosts.map((post) => (
              <PromptCard
                key={post._id}
                post={post}
                handleTagClick={handleTagClick}
              />
            ))}
      </div>
    </section>
  );
};

export default Feed;
