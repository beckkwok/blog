import type { CollectionConfig } from 'payload'

import { contactFormAccess } from './helpers/access'

export const Contact: CollectionConfig = {
  slug: 'contact',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'handled', 'createdAt'],
  },
  access: contactFormAccess,
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Honeypot: real users never fill this hidden field.
        if (data && typeof data.website === 'string' && data.website.length > 0) {
          throw new Error('Submission rejected.')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      maxLength: 200,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
}
