---
inject: true
to: src/entities/index.ts
after: 'const entities: EntityList = {'
skip_if: <%= Name %>,
---
  <%= Name %>,