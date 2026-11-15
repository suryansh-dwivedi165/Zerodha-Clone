import React from "react";

const helpTopics = [
  {
    title: "Account opening",
    description: "Help with creating and setting up your account.",
    icon: "＋",
    links: [
      "Open an account online",
      "Complete account verification",
      "Account opening charges",
      "Getting started",
    ],
  },
  {
    title: "Your account",
    description: "Manage your profile, login details, and segments.",
    icon: "◎",
    links: [
      "Login credentials",
      "Update your profile",
      "Add a trading segment",
      "Bank and demat details",
    ],
  },
  {
    title: "Trading and orders",
    description: "Understand orders, products, and trading tools.",
    icon: "↗",
    links: [
      "Order types explained",
      "Why was my order rejected?",
      "Kite web and mobile",
      "Trading FAQs",
    ],
  },
  {
    title: "Funds",
    description: "Learn about adding, withdrawing, and tracking funds.",
    icon: "₹",
    links: [
      "Add funds to your account",
      "Withdraw funds",
      "Fund transfer timelines",
      "Add or change a bank account",
    ],
  },
  {
    title: "Reports and portfolio",
    description: "Find reports and understand your investments.",
    icon: "▤",
    links: [
      "View account reports",
      "Understand your ledger",
      "Track your portfolio",
      "Corporate actions",
    ],
  },
  {
    title: "Platforms and apps",
    description: "Get help with Zerodha platforms and connected apps.",
    icon: "▣",
    links: [
      "Kite platform guide",
      "Console reports",
      "Coin mutual funds",
      "Kite Connect API",
    ],
  },
];

const CreateTicket = ({ search }) => {
  const query = search.trim().toLowerCase();
  const filteredTopics = helpTopics
    .map((topic) => {
      if (!query) return topic;
      const matchesTitle =
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query);
      const matchingLinks = topic.links.filter((link) =>
        link.toLowerCase().includes(query)
      );
      return matchesTitle
        ? topic
        : { ...topic, links: matchingLinks };
    })
    .filter((topic) => !query || topic.links.length > 0);

  return (
    <section className="support-topics-section" id="help-topics">
      <div className="support-topics-heading">
        <div>
          <span className="support-eyebrow">HELP CENTER</span>
          <h2>{query ? "Search results" : "Browse help topics"}</h2>
        </div>
        <span className="support-results-count">
          {filteredTopics.length} {filteredTopics.length === 1 ? "topic" : "topics"}
        </span>
      </div>

      {filteredTopics.length > 0 ? (
        <div className="support-topic-grid">
          {filteredTopics.map(({ title, description, icon, links }) => (
            <article className="support-topic-card" key={title}>
              <div className="support-topic-card-heading">
                <span className="support-topic-icon">
                  <span aria-hidden="true">{icon}</span>
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
              <ul>
                {links.map((link) => (
                  <li key={link}>
                    <a href="mailto:support@zerodha.com?subject=Support%20request">
                      {link}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ) : (
        <div className="support-no-results">
          <h3>No matching topics found</h3>
          <p>Try a different search, or contact our support team.</p>
          <a href="mailto:support@zerodha.com">Contact support</a>
        </div>
      )}

      <div className="support-contact-card">
        <div>
          <h3>Still need help?</h3>
          <p>Our support team is ready to help with your question.</p>
        </div>
        <a href="mailto:support@zerodha.com">Contact support</a>
      </div>
    </section>
  );
};

export default CreateTicket;
