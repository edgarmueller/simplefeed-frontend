import { buildCommentTree } from './comments'
import { Comment } from './domain.interface'

const comment = (id: string, path: string): Comment => ({
  id,
  path,
  content: id,
  author: 'bart',
  createdAt: '2026-01-01T00:00:00Z',
})

describe('buildCommentTree', () => {
  // a comment's path lists its ancestors, starting with the post
  it('nests replies under the comment their path ends with', () => {
    const tree = buildCommentTree([
      comment('c-1', 'p_1'),
      comment('c-2', 'p_1.c_1'),
      comment('c-3', 'p_1'),
    ])

    expect(tree.map((node) => node.comment.id)).toEqual(['c-1', 'c-3'])
    expect(tree[0].children.map((node) => node.comment.id)).toEqual(['c-2'])
  })
})
