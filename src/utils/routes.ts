// Centralized routing configuration
export const ROUTES = {
  HOME: '/',
  SMART_START_MODE: '/smart-start-mode',
  PRO_MODE: '/pro-mode',
  ABOUT: '/about',
  GUIDE: '/guide'
} as const;

export const ROUTE_NAMES = {
  HOME: 'Home',
  SMART_START_MODE: 'Smart Start Mode',
  PRO_MODE: 'Pro Mode',
  ABOUT: 'About',
  GUIDE: 'Guide'
} as const;

// Helper function to convert display names to URL paths
export function getRoutePath(displayName: string): string {
  const nameToPath: Record<string, string> = {
    [ROUTE_NAMES.HOME]: ROUTES.HOME,
    [ROUTE_NAMES.SMART_START_MODE]: ROUTES.SMART_START_MODE,
    [ROUTE_NAMES.PRO_MODE]: ROUTES.PRO_MODE,
    [ROUTE_NAMES.ABOUT]: ROUTES.ABOUT,
    [ROUTE_NAMES.GUIDE]: ROUTES.GUIDE
  };
  
  return nameToPath[displayName] || ROUTES.HOME;
}

// Helper function to get display name from path
export function getDisplayName(path: string): string {
  const pathToName: Record<string, string> = {
    [ROUTES.HOME]: ROUTE_NAMES.HOME,
    [ROUTES.SMART_START_MODE]: ROUTE_NAMES.SMART_START_MODE,
    [ROUTES.PRO_MODE]: ROUTE_NAMES.PRO_MODE,
    [ROUTES.ABOUT]: ROUTE_NAMES.ABOUT,
    [ROUTES.GUIDE]: ROUTE_NAMES.GUIDE
  };
  
  return pathToName[path] || ROUTE_NAMES.HOME;
}

// Get all navigation items
export function getNavigationItems(): string[] {
  return Object.values(ROUTE_NAMES);
} 