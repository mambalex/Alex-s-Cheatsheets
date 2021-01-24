import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import { v4 as uuidv4 } from "uuid"
import "../styles/cheatsheet.scss"
import Layout from "../components/layout"
import SEO from "../components/seo"

const applyCustomRules = html => {
  let modifiedHTML
  // References
  const regex = new RegExp("</div>\n<p>See: <a", "g")
  modifiedHTML = html
    .replace(regex, "<p class='reference'>See: <a target='_blank'")
    .replace(/<\/a><\/p>/g, "</a></p></div>")

  // Columns

  // {col-2/2}
  const regex2 = /<p>{col-2\/2}<\/p>([\s\S]*?)<\/div>([\s\S]*?)<\/div>/g
  modifiedHTML = modifiedHTML
    .replace(regex2, "<div class='col-2'>$1</div>$2</div></div>")
    .replace(/<p>{col-2\/2}<\/p>/, "")
  // {col-1/2}
  const regex3 = /<p>{col-1\/2}<\/p>([\s\S]*?)<\/div>/g
  modifiedHTML = modifiedHTML
    .replace(regex3, "<div class='col-2'>$1</div></div>")
    .replace(/<p>{col-1\/2}<\/p>/, "")

  return modifiedHTML
}

export default function Template({ data, location }) {
  const [hash, setHash] = useState("")
  const { markdownRemark } = data
  const { frontmatter, html, headings } = markdownRemark

  const onClickSidebar = hash => {
    setHash(hash)
  }

  return (
    <Layout>
      <SEO title={frontmatter.title} />
      <Link to="/" className="back-arrow">
        <svg
          stroke="currentColor"
          fill="rgb(86, 42, 120)"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="2em"
          width="2em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
        </svg>
      </Link>
      <h1
        style={{
          fontFamily: "Realtime-semibold",
          fontWeight: "lighter",
        }}
      >
        {frontmatter.title}
      </h1>
      <div className="container">
        <div className="sidebar">
          <div className="wrapper">
            <ul>
              {headings.map(el => (
                <li
                  key={uuidv4()}
                  className={
                    hash === el.value.toLowerCase().replace(/ /g, "-")
                      ? "active"
                      : ""
                  }
                >
                  <Link
                    to={`${location.pathname}#${el.value
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    onClick={() =>
                      onClickSidebar(el.value.toLowerCase().replace(/ /g, "-"))
                    }
                  >
                    {el.value}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="content">
          <div dangerouslySetInnerHTML={{ __html: applyCustomRules(html) }} />
        </div>
      </div>
    </Layout>
  )
}

export const templateQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      headings {
        value
      }
      frontmatter {
        slug
        title
      }
    }
  }
`
