import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Skip all internal paths (_next)
    // Skip all static files (svg, jpg, png, etc.)
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
