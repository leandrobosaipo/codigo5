import blogPostsData from "./blog-posts.json";

type BlogTerm = {
  id: number;
  name: string;
  slug: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  date: string;
  modified: string;
  image: string | null;
  link: string;
  seoTitle: string;
  seoDescription: string;
  categories: BlogTerm[];
  tags: BlogTerm[];
  readingMinutes: number;
};

type BlogCollectionTerm = BlogTerm & {
  count: number;
};

export const blogPosts = blogPostsData as BlogPost[];

const buildTerms = (selector: (post: BlogPost) => BlogTerm[]) => {
  const map = new Map<string, BlogCollectionTerm>();

  blogPosts.forEach((post) => {
    selector(post).forEach((term) => {
      const current = map.get(term.slug);
      if (current) {
        current.count += 1;
        return;
      }

      map.set(term.slug, {
        ...term,
        count: 1,
      });
    });
  });

  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const blogCategories = buildTerms((post) =>
  post.categories.filter((category) => category.slug !== "blog"),
);

export const blogTags = buildTerms((post) => post.tags);

export const featuredBlogPosts = blogPosts.slice(0, 3);

export const getBlogPostBySlug = (slug?: string) =>
  blogPosts.find((post) => post.slug === slug);

export const getPostsByCategory = (slug?: string) =>
  blogPosts.filter((post) => post.categories.some((category) => category.slug === slug));

export const getPostsByTag = (slug?: string) =>
  blogPosts.filter((post) => post.tags.some((tag) => tag.slug === slug));

export const getCategoryBySlug = (slug?: string) =>
  blogCategories.find((category) => category.slug === slug);

export const getTagBySlug = (slug?: string) =>
  blogTags.find((tag) => tag.slug === slug);
