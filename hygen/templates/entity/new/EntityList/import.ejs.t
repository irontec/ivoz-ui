---
inject: true
to: src/entities/index.ts
after: 'import { EntityList } from "@irontec/ivoz-ui";'
skip_if: <%= Name %>
---
import <%= Name %> from './<%= Name %>/<%= Name %>';