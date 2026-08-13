import type { CollectionConfig } from 'payload'

type CollectionAccess = CollectionConfig['access']

const protectedContentAccess: CollectionAccess = {
  create: ({ req }) => !!req.user,
  read: () => true,
  update: ({ req }) => !!req.user,
  delete: ({ req }) => !!req.user,
}

// Public read for content collections; submissions accepted from anyone, reads restricted to admins
export const publicCollectionAccess: CollectionAccess = { ...protectedContentAccess }

export const contactFormAccess: CollectionAccess = {
  create: () => true,
  read: ({ req }) => !!req.user,
  update: ({ req }) => !!req.user,
  delete: ({ req }) => !!req.user,
}

// Private collections (e.g. Knowledge for the RAG): admin-only for every operation
export const privateCollectionAccess: CollectionAccess = {
  create: ({ req }) => !!req.user,
  read: ({ req }) => !!req.user,
  update: ({ req }) => !!req.user,
  delete: ({ req }) => !!req.user,
}