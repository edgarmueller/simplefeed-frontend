import { Comment } from '../model/domain.interface';

export interface CommentNode {
  comment: Comment;
  children: CommentNode[];
}

function escape(path: string) {
  const ret = path.replace(/-/g, "_").replace(/\//gi, '.');
  return ret
}

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const commentMap = new Map<string, CommentNode>();

  // First pass: create a CommentNode for each comment
  for (const comment of comments) {
    commentMap.set(escape(comment.id), {
      comment,
      children: [],
    });
  }

  // Second pass: link CommentNodes based on their paths
  for (const comment of comments) {
    const path = escape(comment.path).split(".");
    if (path.length > 1) {
      const parentId = escape(path[path.length - 1]);
      const parent = commentMap.get(parentId);
      if (parent) {
        parent.children.push(commentMap.get(escape(comment.id))!);
      }
    }
  }

  // Return the root nodes (comments with no parents)
  return Array.from(commentMap.values()).filter((node) => {
    const path = node.comment.path?.split(".");
    return path.length === 1;
  });
}
