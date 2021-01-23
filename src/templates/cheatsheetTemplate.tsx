import React, { useState } from "react"
import { graphql, Link } from "gatsby"
import { v4 as uuidv4 } from "uuid"

import Layout from "../components/layout"
import SEO from "../components/seo"

const applyCustomRules = html => {
  const regex = new RegExp("</div>\n<p>See: <a", "g")
  return html
    .replace(regex, "<p class='reference'>See: <a target='_blank'")
    .replace(/<\/a><\/p>/g, "</a></p></div>")
}

export default function Template({ data, location }) {
  const [hash, setHash] = useState("")
  const { markdownRemark } = data
  const { frontmatter, html, headings } = markdownRemark

  const onClickSidebar = hash => {
    setHash(hash)
  }
  console.log(html)

  return (
    <Layout>
      <SEO title={frontmatter.title} />

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

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      headings {
        value
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
      }
    }
  }
`
