import React, { useRef, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'

import './index.css'

export const GROUP_TITLES = {
  'front-end': '前端杂谈',
  'javascript-algorithm-and-data-structure': 'JavaScript数据结构和算法',
  'redbook-series': 'JavaScript高级程序设计',
  'non-tech': '日常杂谈',
  'automated-driving': '自动驾驶',
}

export default function ArticleNavigator({ currArticle }) {
  const articleGroups = useStaticQuery(graphql`
    query {
      allFile {
        group(field: relativeDirectory) {
          nodes {
            childMdx {
              slug
              frontmatter {
                title
              }
            }
          }
          fieldValue
        }
      }
    }
  `).allFile.group.filter(({ fieldValue }) => {
    if (currArticle.slug.startsWith('non-tech')) {
      return fieldValue === 'non-tech'
    } else {
      return fieldValue !== 'non-tech'
    }
  })

  const ref = useRef()
  const switchRef = useRef()

  function toggleTableOfContent() {
    ref.current.classList.toggle('article-navigator-visible')
  }

  useEffect(() => {
    const handler = e => {
      const { target } = e
      if (
        !switchRef.current.contains(target) &&
        !ref.current.contains(target)
      ) {
        ref.current.classList.remove('article-navigator-visible')
      }
    }
    window.addEventListener('mousedown', handler)
    return () => {
      window.removeEventListener('mousedown', handler)
    }
  }, [])

  return (
    <>
      <div
        className="article-navigator-switch"
        ref={switchRef}
        onClick={toggleTableOfContent}
      >
        <FontAwesomeIcon icon={faList} />
      </div>
      <div className="article-navigator" ref={ref}>
        {articleGroups.map((articleGroup, idx) => {
          const groupTitle = GROUP_TITLES[articleGroup.fieldValue]
          const articles = articleGroup.nodes
            .map(({ childMdx }) => ({
              slug: childMdx.slug,
              title: childMdx.frontmatter.title,
            }))
            .sort((a, b) => a.slug.localeCompare(b.slug))
          return (
            <React.Fragment key={idx}>
              <h4>{groupTitle}</h4>
              {articles.map(({ slug, title }, idx) => (
                <p
                  key={idx}
                  onClick={() => navigate('/articles/' + slug)}
                  title={title}
                  className={
                    currArticle.slug === slug
                      ? 'highlighted-navigator-item'
                      : ''
                  }
                >
                  {title}
                </p>
              ))}
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}
