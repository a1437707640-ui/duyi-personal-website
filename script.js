document.documentElement.classList.add("js-ready");

const yearNode = document.querySelector("#year");
const revealNodes = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll("[data-filter-button]")];
const feedCards = [...document.querySelectorAll(".feed-card")];
const feedGroups = [...document.querySelectorAll(".feed-group")];
const sidebarLinks = [...document.querySelectorAll(".sidebar-link")];
const topicButtons = [...document.querySelectorAll("[data-topic-query]")];
const quickQueryButtons = [...document.querySelectorAll("[data-quick-query]")];
const searchInput = document.querySelector("#site-search");
const searchReset = document.querySelector("#search-reset");
const sections = [...document.querySelectorAll("[id]")].filter((node) =>
  ["overview", "experience", "projects", "writing", "contact"].includes(node.id)
);
let activeFilter = "all";
let activeQuery = "";

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
  revealObserver.observe(node);
});

const syncFeedVisibility = () => {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  feedCards.forEach((card) => {
    const tracks = (card.dataset.track || "").split(" ").filter(Boolean);
    const matchesFilter = activeFilter === "all" || tracks.includes(activeFilter);
    const haystack = card.textContent.toLowerCase();
    const matchesQuery = !activeQuery || haystack.includes(activeQuery);
    card.hidden = !(matchesFilter && matchesQuery);
  });

  feedGroups.forEach((group) => {
    const hasVisibleCard = [...group.querySelectorAll(".feed-card")].some(
      (card) => !card.hidden
    );
    group.hidden = !hasVisibleCard;
  });
};

const applyFilter = (filter) => {
  activeFilter = filter;
  syncFeedVisibility();
};

const applyQuery = (query) => {
  activeQuery = query.trim().toLowerCase();

  if (searchInput && searchInput.value !== query) {
    searchInput.value = query;
  }

  if (searchReset) {
    searchReset.hidden = !activeQuery;
  }

  syncFeedVisibility();
};

const scrollToTarget = (selector) => {
  if (!selector) {
    return;
  }

  const target = document.querySelector(selector);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter || "all");
  });
});

topicButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter("all");
    applyQuery(button.dataset.topicQuery || "");
    scrollToTarget(button.dataset.scrollTarget);
  });
});

quickQueryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter("all");
    applyQuery(button.dataset.quickQuery || "");
    scrollToTarget(button.dataset.scrollTarget);
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    applyQuery(target.value);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    applyQuery("");
  });
}

if (searchReset) {
  searchReset.addEventListener("click", () => {
    applyQuery("");
    searchInput?.focus();
  });
}

applyFilter("all");
applyQuery("");

const syncActiveNav = () => {
  const scrollMarker = window.scrollY + window.innerHeight * 0.24;
  let currentId = sections[0]?.id || "overview";

  sections.forEach((section) => {
    if (scrollMarker >= section.offsetTop) {
      currentId = section.id;
    }
  });

  sidebarLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
  });
};

syncActiveNav();
window.addEventListener("scroll", syncActiveNav, { passive: true });
