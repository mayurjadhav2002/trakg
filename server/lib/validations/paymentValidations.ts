import { IncomingHttpHeaders } from 'http';

export function validateWebhookHeaders(headers: IncomingHttpHeaders) {
  const id = headers['webhook-id'];
  const signature = headers['webhook-signature'];
  const timestamp = headers['webhook-timestamp'];

  if (!id || !signature || !timestamp) {
    throw new Error('Missing required webhook headers');
  }

  return {
    'webhook-id': Array.isArray(id) ? id[0] : id,
    'webhook-signature': Array.isArray(signature) ? signature[0] : signature,
    'webhook-timestamp': Array.isArray(timestamp) ? timestamp[0] : timestamp,
  };
}
