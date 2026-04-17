// Compatibility shim: re-exports getCloudflareContext as getRequestContext
import { getCloudflareContext } from '@opennextjs/cloudflare';
export const getRequestContext = getCloudflareContext;
