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
        "/Users/dh/Desktop/illustrations/ai-dialogue-tips/": "../assets/article-media/ai-dialogue-tips/",
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
            <title>{meta.title} | 杜一的人生实验室</title>
            <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
            <link rel="stylesheet" href="{CSS_PATH}" />
          </head>
          <body>
            <div class="article-shell">
              <header class="article-topbar">
                <a href="../index.html" class="back-link">返回首页</a>
                <a href="./index.html" class="back-link">文章库</a>
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


def index_html() -> str:
    featured_cards = []
    archive_cards = []

    for meta in ARTICLES:
        card = textwrap.dedent(
            f"""\
            <a class="library-card" href="./{meta.slug}.html">
              <div class="library-meta">
                <span>{meta.category}</span>
                <span>{meta.date}</span>
                <span>{meta.reading_time}</span>
              </div>
              <h2>{meta.title}</h2>
              <p>{meta.summary}</p>
            </a>
            """
        )
        if meta.featured:
            featured_cards.append(card)
        archive_cards.append(card)

    featured_html = "\n".join(featured_cards)
    archive_html = "\n".join(archive_cards)

    return textwrap.dedent(
        f"""\
        <!DOCTYPE html>
        <html lang="zh-CN">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="杜一的人生实验室文章库，收录 AI、系统构建、教程与排障文章。" />
            <title>文章库 | 杜一的人生实验室</title>
            <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
            <link rel="stylesheet" href="{CSS_PATH}" />
          </head>
          <body>
            <div class="article-shell">
              <header class="article-topbar">
                <a href="../index.html" class="back-link">返回首页</a>
              </header>

              <main class="library-layout">
                <section class="library-hero">
                  <p class="library-kicker">Article Library</p>
                  <h1>把桌面上的文章，整理成一个可持续更新的网站。</h1>
                  <p>
                    这里先保留这一篇核心文章，后续如果你继续补 Markdown，再重新生成文章页就行。
                  </p>
                </section>

                <section class="library-section">
                  <div class="section-head">
                    <p>当前文章</p>
                    <h2>先把这一篇上线，后面再逐步扩充。</h2>
                  </div>
                  <div class="library-grid">
                    {featured_html}
                  </div>
                </section>

                <section class="library-section">
                  <div class="section-head">
                    <p>后续更新</p>
                    <h2>以后新增文章时，只需要补 Markdown，再运行生成脚本。</h2>
                  </div>
                  <p class="library-note">
                    当前这个站点已经收缩为单篇文章版本。等你下一次把新文章发给我，我可以继续帮你补回文章列表、封面图和栏目页。
                  </p>
                </section>
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

    (ARTICLES_DIR / "index.html").write_text(index_html(), encoding="utf-8")


if __name__ == "__main__":
    main()
