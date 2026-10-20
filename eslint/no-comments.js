const allowed = [
  /^\s*See docs\/\S+(,\s*docs\/\S+)*(\s+or\s+[A-Z][A-Z0-9]+-\d+)?\s*$/,
  /^\s*[A-Z][A-Z0-9]+-\d+\s*$/,
  /^\/\s*<reference\s/,
]

const isAllowed = (text) => allowed.some((pattern) => pattern.test(text))

export default {
  meta: {
    type: 'problem',
    docs: { description: 'Only a bare docs or ticket reference may be a comment (docs/architecture/16-development-standards.md)' },
    messages: { comment: 'Comments are not allowed; only "See docs/..." or a ticket id.' },
    schema: [],
  },
  create(context) {
    const source = context.sourceCode
    const report = (comment) => {
      if (!isAllowed(comment.value)) context.report({ loc: comment.loc, messageId: 'comment' })
    }
    return {
      'Program:exit'(program) {
        source.getAllComments().forEach(report)
        program.templateBody?.comments?.forEach(report)
      },
    }
  },
}
