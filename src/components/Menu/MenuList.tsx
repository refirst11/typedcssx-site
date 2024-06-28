'use client'

import { useState, useEffect, Fragment } from 'react'
import { styles } from './style.css'
import Link from 'next/link'
import type PostsData from 'types/PostsData'
import { usePathname, useRouter } from 'next/navigation'
import { IoMdArrowDropright } from 'react-icons/io'
import { handleLinkClick } from 'lib/handleLinkClick'
import { headings } from 'lib/headings'

type MenuProps = {
  posts: PostsData[]
}

const MenuList = ({ posts }: MenuProps) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isListVisible, setIsListVisible] = useState(false)
  const [activeHeading, setActiveHeading] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }

    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [open])

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('h2, h3')
      let currentActiveHeading = ''

      headingElements.forEach((heading) => {
        const { top } = heading.getBoundingClientRect()
        if (top <= 150) {
          currentActiveHeading = heading.id
        }
      })

      setActiveHeading(currentActiveHeading)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (pathname !== '/') setIsListVisible(true)
  }, [pathname])

  return (
    <>
      <div className={styles.Line}>
        <button
          aria-expanded={open}
          onClick={() => {
            setOpen(!open)
          }}
          aria-label="Toggle mobile navigation menu"
          type="button">
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={styles.menu} aria-hidden={!open}>
        <ul className={styles.menu_list}>
          <li>
            <Link className={styles.active} href="/" onClick={() => setOpen(false)} aria-current={'/' === pathname ? 'page' : 'false'}>
              Home
            </Link>
          </li>
          <li className={`${styles.docs} ${isListVisible ? styles.activeDocs : ''}`} onClick={() => setIsListVisible(!isListVisible)}>
            Documentation
            <IoMdArrowDropright style={{ rotate: isListVisible ? '90deg' : '0deg' }} />
          </li>
          <ul className={`${styles.documentItems} ${isListVisible ? styles.visible : ''}`}>
            {posts?.map(({ slug, title }, postIndex) => (
              <Fragment key={postIndex}>
                <li key={slug}>
                  <Link className={styles.active} href={`/${slug}`} onClick={() => setOpen(false)} aria-current={'/' + slug === pathname ? 'page' : 'false'}>
                    {title}
                  </Link>
                </li>
                {pathname === '/' + slug && (
                  <ul className={styles.headingItems}>
                    {headings[postIndex]?.heading.map((heading, headingIndex) => (
                      <li key={`${slug}-heading-${headingIndex}`}>
                        <Link
                          className={styles.active}
                          href={`/${slug}#${heading.id}`}
                          onClick={(e) => {
                            handleLinkClick(router, e, slug, heading.id)
                            setOpen(false)
                          }}
                          aria-current={activeHeading === heading.id ? 'page' : 'false'}>
                          {heading.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Fragment>
            ))}
          </ul>
        </ul>
      </div>
    </>
  )
}

export default MenuList
