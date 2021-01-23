// import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"

const Header = ({ siteTitle }) => (
  <header
    style={{
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <Link to="/">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="2em"
          width="2em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
        </svg>
      </Link>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
