export type ProjectInteraction = {
  projectId: string;
  liked: boolean;
  like_count: number;
  comment_count: number;
};

export type ProjectComment = {
  id: string;
  projectId: string;
  name: string;
  body: string;
  createdAt: string;
  status: "pending" | "approved";
};

export type CommentPage = { comments: ProjectComment[]; nextCursor: string | null };
