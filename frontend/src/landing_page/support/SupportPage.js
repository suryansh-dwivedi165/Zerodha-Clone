import React, { useState } from "react";
import Hero from "./Hero";
import CreateTicket from "./CreateTicket";
import "./SupportPage.css";

const SupportPage = () => {
  const [search, setSearch] = useState("");

  return (
    <main className="support-page">
      <Hero search={search} onSearchChange={setSearch} />
      <CreateTicket search={search} />
    </main>
  );
};

export default SupportPage;
