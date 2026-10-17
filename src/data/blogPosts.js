import { blogData } from './layoutData'


const extra = {
  'blog-1': {
    slug: 'scandinavian-minimalist-layouts',
    categoryKey: 'blog_categories.decor_ideas', 
    author: 'Elena Rostova',
    readTime: 4,
    excerptKey: 'blogs.blog_1.excerpt',
    relatedProductIds: ['lum-013', 'lum-001', 'lum-012', 'lum-020'],
    contentKeys: [
      { type: 'p', key: 'blogs.blog_1.p1' },
      { type: 'h2', key: 'blogs.blog_1.h1' },
      { type: 'p', key: 'blogs.blog_1.p2' },
      { type: 'h2', key: 'blogs.blog_1.h2' },
      { type: 'p', key: 'blogs.blog_1.p3' },
      { type: 'h2', key: 'blogs.blog_1.h3' },
      { type: 'ul', listKey: 'blogs.blog_1.ul1' } 
    ],
  },
  'blog-2': {
    slug: 'walnut-vs-oak',
    categoryKey: 'blog_categories.buying_guides',
    author: 'Marcus Vance',
    readTime: 4,
    excerptKey: 'blogs.blog_2.excerpt',
    relatedProductIds: ['lum-003', 'lum-023', 'lum-024', 'lum-015'],
    contentKeys: [
      { type: 'p', key: 'blogs.blog_2.p1' },
      { type: 'h2', key: 'blogs.blog_2.h1' },
      { type: 'p', key: 'blogs.blog_2.p2' },
      { type: 'h2', key: 'blogs.blog_2.h2' },
      { type: 'p', key: 'blogs.blog_2.p3' },
      { type: 'h2', key: 'blogs.blog_2.h3' },
      { type: 'ul', listKey: 'blogs.blog_2.ul1' }
    ],
  },
  'blog-3': {
    slug: 'lighting-open-spaces',
    categoryKey: 'blog_categories.decor_ideas',
    author: 'Sarah Jenkins',
    readTime: 3,
    excerptKey: 'blogs.blog_3.excerpt',
    relatedProductIds: ['lum-012', 'lum-014', 'lum-005', 'lum-013'],
    contentKeys: [
      { type: 'p', key: 'blogs.blog_3.p1' },
      { type: 'h2', key: 'blogs.blog_3.h1' },
      { type: 'ul', listKey: 'blogs.blog_3.ul1' },
      { type: 'h2', key: 'blogs.blog_3.h2' },
      { type: 'p', key: 'blogs.blog_3.p2' },
      { type: 'h2', key: 'blogs.blog_3.h3' },
      { type: 'p', key: 'blogs.blog_3.p3' }
    ],
  },
  'blog-4': {
    slug: 'compact-apartment-floor-plans',
    categoryKey: 'blog_categories.small_spaces',
    author: 'Alexander Wright',
    readTime: 4,
    excerptKey: 'blogs.blog_4.excerpt',
    relatedProductIds: ['lum-021', 'lum-022', 'lum-017', 'lum-026'],
    contentKeys: [
      { type: 'p', key: 'blogs.blog_4.p1' },
      { type: 'h2', key: 'blogs.blog_4.h1' },
      { type: 'p', key: 'blogs.blog_4.p2' },
      { type: 'h2', key: 'blogs.blog_4.h2' },
      { type: 'ul', listKey: 'blogs.blog_4.ul1' },
      { type: 'h2', key: 'blogs.blog_4.h3' },
      { type: 'p', key: 'blogs.blog_4.p3' }
    ],
  },
  'blog-5': {
    slug: 'sustainable-materials-home-decor',
    categoryKey: 'blog_categories.care_and_materials',
    author: 'Elena Rostova',
    readTime: 3,
    excerptKey: 'blogs.blog_5.excerpt',
    relatedProductIds: ['lum-018', 'lum-010', 'lum-020', 'lum-003'],
    contentKeys: [
      { type: 'p', key: 'blogs.blog_5.p1' },
      { type: 'h2', key: 'blogs.blog_5.h1' },
      { type: 'ul', listKey: 'blogs.blog_5.ul1' },
      { type: 'h2', key: 'blogs.blog_5.h2' },
      { type: 'p', key: 'blogs.blog_5.p2' }
    ],
  },
}

// Combines standard layout items with localized lookup keys securely
export const blogPosts = blogData.map((post) => ({ ...post, ...extra[post.id] }))

// Returns distinct unique translation category pointer strings
export const blogCategories = [...new Set(blogPosts.map((p) => p.categoryKey))]
