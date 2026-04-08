from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import textwrap

import markdown


ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content" / "articles"
ARTICLES_DIR = ROOT / "articles"
CSS_PATH = "../article.css"


@dataclass(frozen=True)
class ArticleMeta:
    slug: str
    source: str
    title: str
    summary: str
    category: str
    date: str
    reading_time: str
    featured: bool = False


ARTICLES = [
    ArticleMeta(
        slug="claude-code-vps-residential-ip",
        source="claude-code-vps-residential-ip.md",
        title="用 Claude Code 一键配置 VPS + 住宅 IP",
        summary="把 VPS、住宅 IP、订阅服务和客户端导入串成一条自动化流程，适合做成可复制的实操手册。",
        category="代理搭建",
        date="2026-04",
        reading_time="9 分钟",
        featured=True,
    ),
]


def strip_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return text
    return parts[2].lstrip()


def rewrite_asset_paths(text: str) -> str:
    replacements = {
        "illustrations/writing-practice/": "../assets/article-media/writing-practice/",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return text


def strip_leading_title(text: str) -> str:
    lines = text.splitlines()
    for index, line in enumerate(lines):
        if not line.strip():
            continue
        if line.startswith("# "):
            return "\n".join(lines[index + 1 :]).lstrip()
        break
    return text


def render_markdown(text: str) -> str:
    cleaned = strip_leading_title(rewrite_asset_paths(strip_frontmatter(text)))
    html = markdown.markdown(
        cleaned,
        extensions=["extra", "admonition", "sane_lists", "toc"],
        output_format="html5",
    )
    return html


def article_html(meta: ArticleMeta, body_html: str) -> str:
    return textwrap.dedent(
        f"""\
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="{meta.summary}" />
            <title>{meta.title} | 杜一的个人博客</title>
            <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
            <link rel="stylesheet" href="{CSS_PATH}" />
          </head>
          <body>
            <div class="article-shell">
              <header class="article-topbar">
                <a href="../index.html" class="back-link">返回首页</a>
              </header>

              <main class="article-layout">
                <article class="article-card">
                  <div class="article-meta">
                    <span>{meta.category}</span>
                    <span>{meta.date}</span>
                    <span>{meta.reading_time}</span>
                  </div>
                  <h1>{meta.title}</h1>
                  <p class="article-summary">{meta.summary}</p>
                  <div class="article-body">
                    {body_html}
                  </div>
                </article>
              </main>
            </div>
          </body>
        </html>
        """
    )


def main() -> None:
    ARTICLES_DIR.mkdir(exist_ok=True)

    for meta in ARTICLES:
        source_path = CONTENT_DIR / meta.source
        body_html = render_markdown(source_path.read_text(encoding="utf-8"))
        target_path = ARTICLES_DIR / f"{meta.slug}.html"
        target_path.write_text(article_html(meta, body_html), encoding="utf-8")


if __name__ == "__main__":
    main()
