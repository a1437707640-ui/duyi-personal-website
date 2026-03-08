document.documentElement.classList.add("js-ready");

const yearNode = document.querySelector("#year");
const revealNodes = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll("[data-filter-button]")];
const feedCards = [...document.querySelectorAll(".feed-card")];
const feedGroups = [...document.querySelectorAll(".feed-group")];
const sidebarLinks = [...document.querySelectorAll(".sidebar-link")];
const sections = [...document.querySelectorAll("[id]")].filter((node) =>
  ["overview", "experience", "projects", "writing", "contact"].includes(node.id)
);

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

const applyFilter = (filter) => {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  feedCards.forEach((card) => {
    const tracks = (card.dataset.track || "").split(" ").filter(Boolean);
    const isVisible = filter === "all" || tracks.includes(filter);
    card.hidden = !isVisible;
  });

  feedGroups.forEach((group) => {
    const hasVisibleCard = [...group.querySelectorAll(".feed-card")].some(
      (card) => !card.hidden
    );
    group.hidden = !hasVisibleCard;
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter || "all");
  });
});

applyFilter("all");

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
