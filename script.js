document.documentElement.classList.add("js-ready");

const yearNode = document.querySelector("#year");
const revealNodes = [...document.querySelectorAll(".reveal")];
const feedCards = [...document.querySelectorAll(".feed-card")];

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
