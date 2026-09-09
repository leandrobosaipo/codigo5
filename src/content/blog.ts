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

export const sortBlogPosts = (posts: BlogPost[]) => [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export const sortedBlogPosts = sortBlogPosts(blogPosts);

export const buildTerms = (posts: BlogPost[], selector: (post: BlogPost) => BlogTerm[]) => {
  const map = new Map<string, BlogCollectionTerm>();

  posts.forEach((post) => {
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

export const blogCategories = buildTerms(blogPosts, (post) =>
  post.categories.filter((category) => category.slug !== "blog"),
);

export const blogTags = buildTerms(blogPosts, (post) => post.tags);

export const featuredBlogPosts = sortedBlogPosts.slice(0, 3);

export const recentBlogPosts = sortedBlogPosts.slice(0, 6);

export const getBlogPostBySlug = (slug?: string, posts: BlogPost[] = sortedBlogPosts) =>
  posts.find((post) => post.slug === slug);

export const getPostsByCategory = (slug?: string, posts: BlogPost[] = sortedBlogPosts) =>
  posts.filter((post) => post.categories.some((category) => category.slug === slug));

export const getPostsByTag = (slug?: string, posts: BlogPost[] = sortedBlogPosts) =>
  posts.filter((post) => post.tags.some((tag) => tag.slug === slug));

export const getCategoryBySlug = (slug?: string, categories: BlogCollectionTerm[] = blogCategories) =>
  categories.find((category) => category.slug === slug);

export const getTagBySlug = (slug?: string, tags: BlogCollectionTerm[] = blogTags) =>
  tags.find((tag) => tag.slug === slug);

export const getAdjacentPosts = (slug?: string, posts: BlogPost[] = sortedBlogPosts) => {
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: null,
      nextPost: null,
    };
  }

  return {
    previousPost: posts[currentIndex - 1] ?? null,
    nextPost: posts[currentIndex + 1] ?? null,
  };
};

export const mergeBlogPosts = (dynamicPosts: BlogPost[]) => {
  const map = new Map<string, BlogPost>();

  blogPosts.forEach((post) => {
    map.set(post.slug, post);
  });

  dynamicPosts.forEach((post) => {
    map.set(post.slug, {...post, image: post.image || map.get(post.slug)?.image || null});
  });

  return sortBlogPosts([...map.values()]);
};
