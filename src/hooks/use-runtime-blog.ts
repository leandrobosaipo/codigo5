import { useEffect, useMemo, useState } from "react";
import { blogCategories, blogTags, mergeBlogPosts, type BlogPost, buildTerms } from "@/content/blog";

type RuntimeBlogResponse = {
  ok: boolean;
  posts?: BlogPost[];
};

export const useRuntimeBlog = () => {
  const [dynamicPosts, setDynamicPosts] = useState<BlogPost[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/bot/posts");
        if (!response.ok) return;
        const payload = (await response.json()) as RuntimeBlogResponse;
        if (!cancelled && payload.ok) {
          setDynamicPosts(payload.posts ?? []);
        }
      } catch {
        // silent fallback to static blog
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(() => mergeBlogPosts(dynamicPosts), [dynamicPosts]);
  const categories = useMemo(
    () => buildTerms(posts, (post) => post.categories.filter((category) => category.slug !== "blog")),
    [posts],
  );
  const tags = useMemo(() => buildTerms(posts, (post) => post.tags), [posts]);

  return {
    ready,
    posts,
    categories: categories.length ? categories : blogCategories,
    tags: tags.length ? tags : blogTags,
    featuredPosts: posts.slice(0, 3),
    recentPosts: posts.slice(0, 6),
  };
};
