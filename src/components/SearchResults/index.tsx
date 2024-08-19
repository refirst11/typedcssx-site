import { extractHeadingsAndParagraphs } from 'lib/extractHeadingsAndParagraphs'
import Link from 'next/link'
import { styles } from './style.css'
import { useEffect, useState, useMemo, useCallback } from 'react'
import type PostsData from 'types/PostsData'
import PostContent, { HeadingWithParagraphs } from 'types/PostContent'

type KeywordProps = {
  keyword: string
  onClick: React.MouseEventHandler<HTMLElement>
}

export const SearchResults = ({ keyword, onClick }: KeywordProps) => {
  const [posts, setPosts] = useState<PostsData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(true)
  const [cachedContents, setCachedContents] = useState<{ [slug: string]: PostContent }>({})
  const [loadingPosts, setLoadingPosts] = useState<Set<string>>(new Set())
  const [backgroundLoading, setBackgroundLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      const response = await fetch('/api/getAllPosts')
      const postsData: PostsData[] = await response.json()
      setPosts(postsData)
      setIsLoading(false)
    }

    fetchPosts()
  }, [])

  const fetchPostContent = useCallback(
    async (slug: string) => {
      if (!cachedContents[slug] && !loadingPosts.has(slug)) {
        setLoadingPosts((prev) => new Set(prev).add(slug))
        try {
          const response = await fetch(`/api/getPostMdx?slug=${slug}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch post content for ${slug}`)
          }
          const { meta, content } = await response.json()
          const matchedSections = extractHeadingsAndParagraphs(content)
          setCachedContents((prev) => ({
            ...prev,
            [slug]: { meta, content, matchedSections }
          }))
        } catch (error) {
          console.error(`Error fetching content for ${slug}:`, error)
        } finally {
          setLoadingPosts((prev) => {
            const newSet = new Set(prev)
            newSet.delete(slug)
            return newSet
          })
          setIsContentLoading(false)
        }
      }
    },
    [cachedContents, loadingPosts]
  )

  useEffect(() => {
    let isMounted = true
    const loadRemainingContent = async () => {
      if (!backgroundLoading && posts.length > 0) {
        setBackgroundLoading(true)
        for (const post of posts) {
          if (!cachedContents[post.slug] && !loadingPosts.has(post.slug)) {
            await fetchPostContent(post.slug)
            if (!isMounted) break
          }
        }
        setBackgroundLoading(false)
      }
    }

    loadRemainingContent()

    return () => {
      isMounted = false
    }
  }, [posts, cachedContents, loadingPosts, backgroundLoading, fetchPostContent])

  useEffect(() => {
    if (keyword) {
      posts.forEach(({ slug }) => fetchPostContent(slug))
    }
  }, [fetchPostContent, keyword, posts])

  const { filteredPosts, matchedSectionsMap } = useMemo(() => {
    if (!keyword) return { filteredPosts: [], matchedSectionsMap: new Map() }
    const filteredPostsArray: PostsData[] = []
    const matchedSectionsMap = new Map()

    posts.forEach((post) => {
      const { slug } = post
      const matchedSections = cachedContents[slug]?.matchedSections || []
      const filteredSections = matchedSections.filter(
        ({ heading, paragraphs }) =>
          heading.toLowerCase().includes(keyword.toLowerCase()) || paragraphs.some((paragraph) => paragraph.toLowerCase().includes(keyword.toLowerCase()))
      )

      if (filteredSections.length > 0) {
        filteredPostsArray.push(post)
        matchedSectionsMap.set(slug, filteredSections)
      }
    })

    return { filteredPosts: filteredPostsArray, matchedSectionsMap }
  }, [cachedContents, keyword, posts])

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - 76
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  const highlightText = useCallback((text: string, keyword: string) => {
    if (!keyword.trim()) return text
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'))
    return parts.map((part, i) => (
      <span key={i} className={part.toLowerCase() === keyword.toLowerCase() ? styles.highlight : undefined}>
        {part}
      </span>
    ))
  }, [])

  if (isLoading || isContentLoading) {
    return (
      <ul className={styles.list}>
        <p className={styles.no_result}>Loading...</p>
      </ul>
    )
  }

  return (
    <ul onClick={onClick} className={styles.list}>
      {filteredPosts.length > 0 ? (
        filteredPosts.map(({ slug, category }, index) => {
          const matchedSections = matchedSectionsMap.get(slug) as HeadingWithParagraphs[]

          if (!cachedContents[slug]) {
            return <li key={index}>Loading post content...</li>
          }

          return (
            <li key={index}>
              {matchedSections.map(({ heading, paragraphs, id }, index) => (
                <Link
                  key={index}
                  className={styles.link}
                  href={`/${category}${slug}`}
                  onClick={() =>
                    setTimeout(() => {
                      scrollToHeading(id)
                    }, 120)
                  }>
                  <div className={styles.box}>
                    <div className={styles.heading3}>{highlightText(heading, keyword)}</div>

                    {paragraphs.map((paragraph, idx) => (
                      <p className={styles.desc} key={idx}>
                        {highlightText(paragraph, keyword)}
                      </p>
                    ))}
                  </div>
                </Link>
              ))}
            </li>
          )
        })
      ) : (
        <p className={styles.no_result}>No results found.</p>
      )}
    </ul>
  )
}
