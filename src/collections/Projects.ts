import type { CollectionConfig } from 'payload'

import { publicCollectionAccess } from './helpers/access'
import { autoPublishDate } from './hooks/autoPublishDate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'url', 'published', 'updatedAt'],
  },
  access: publicCollectionAccess,
  hooks: {
    beforeChange: [autoPublishDate],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Live site URL',
      },
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'Source code repository URL',
      },
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'tech',
          type: 'text',
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}