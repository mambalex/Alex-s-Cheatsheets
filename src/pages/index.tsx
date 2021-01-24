import React from "react"
import { v4 as uuidv4 } from "uuid"
import { Link, graphql } from "gatsby"
import SEO from "../components/seo"
import "../styles/index.scss"

const IndexPage = ({ data }) => {
  const { allMarkdownRemark } = data
  const { edges } = allMarkdownRemark
  return (
    <div className="home-container">
      <SEO title="Home" />
      <section className="glass">
        <h1>Alex's Cheat Sheets</h1>
        <div>
          {edges.map((edge, index) => (
            <Link to={edge.node.frontmatter.slug} key={uuidv4()}>
              <div className={`card card${(index % 3) + 1}`}>
                {edge.node.frontmatter.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="circle1" />
      <div className="circle2" />
    </div>
  )
}

export const pageQuery = graphql`
  query pageQuery {
    allMarkdownRemark(filter: { html: {} }) {
      edges {
        node {
          frontmatter {
            slug
            title
            order
          }
        }
      }
    }
  }
`

export default IndexPage
