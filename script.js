document.documentElement.classList.add("js-ready");

const focusItems = [
  "OpenClaw 内容工厂",
  "小报童实验日志",
  "AI × 自媒体 × 一人公司",
  "产品化与营销实验",
];

const focusText = document.querySelector("#focus-text");
const yearNode = document.querySelector("#year");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealNodes = [...document.querySelectorAll(".reveal")];
const tiltCards = [...document.querySelectorAll(".tilt-card")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let focusIndex = 0;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (focusText && !prefersReducedMotion.matches) {
  window.setInterval(() => {
    focusIndex = (focusIndex + 1) % focusItems.length;
    focusText.textContent = focusItems[focusIndex];
  }, 2200);
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
  {
    threshold: 0.18,
  }
);

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 70, 260)}ms`;
  revealObserver.observe(node);
});

const syncActiveNav = () => {
  const scrollMarker = window.scrollY + window.innerHeight * 0.28;
  let currentId = sections[0]?.id;

  sections.forEach((section) => {
    if (scrollMarker >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", isActive);
  });
};

syncActiveNav();
window.addEventListener("scroll", syncActiveNav, { passive: true });

if (!prefersReducedMotion.matches) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const rotateY = (relativeX - 0.5) * 8;
      const rotateX = (0.5 - relativeY) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
