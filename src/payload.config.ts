import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { BlogPosts } from './collections/BlogPosts'
import { Projects } from './collections/Projects'
import { Contact } from './collections/Contact'
import { Knowledge } from './collections/Knowledge'
import { KnowledgeChunk } from './collections/KnowledgeChunk'
import {
  deleteKnowledgeChunks,
  reindexKnowledge,
} from './collections/hooks/reindexKnowledge'
import { pgVectorSchemaHook } from './collections/helpers/pgvector'
import { ensureSearchTsvColumn } from './collections/helpers/searchTsv'
import { About } from './collections/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, BlogPosts, Projects, Contact, Knowledge, KnowledgeChunk],
  globals: [About],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Push the schema on startup in production too. There are no committed
    // migrations in this project, so without this the tables would never be
    // created in a fresh production database (dev mode auto-pushes, prod doesn't).
    push: true,
    afterSchemaInit: [pgVectorSchemaHook],
  }),
  onInit: async (payload) => {
    await ensureSearchTsvColumn(payload)
  },
  sharp,
  plugins: [],
})
