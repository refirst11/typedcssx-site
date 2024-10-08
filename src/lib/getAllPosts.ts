'use server'

import fs from 'fs/promises'
import { existsSync } from 'fs'
import matter from 'gray-matter'
import path from 'path'
import PostsData from 'types/PostsData'
import PostsDataMap from 'types/PostsDataMap'

const getAllPosts = async (sourcePath: string): Promise<PostsData[]> => {
  const dirPath = path.join(process.cwd(), 'src', sourcePath)
  if (!existsSync(dirPath)) {
    return []
  }
  const folder = path.join(process.cwd(), `/src/${sourcePath}`)
  const files = await fs.readdir(folder)
  const posts = await Promise.all(
    files.map(async (fileName) => {
      const fullPath = path.join(folder, fileName)
      const file = await fs.readFile(fullPath, 'utf8')
      const { data } = matter<string, PostsDataMap>(file)

      let category = ''
      switch (sourcePath) {
        case 'documentation':
          category = ''
          break
        case 'api':
          category = 'core-api/'
          break
        case 'inheritance':
          category = 'inheritance/'
          break
        case 'animation':
          category = 'animation/'
          break
        default:
          category = ''
      }

      return {
        category,
        slug: fileName.replace(/\.mdx$/, ''),
        title: data.title as string,
        subtitle: data.subtitle as string,
        date: data.date as string
      }
    })
  )
  const data = posts.sort((b, a) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    return dateB.getTime() - dateA.getTime()
  })
  return data
}

export default getAllPosts
