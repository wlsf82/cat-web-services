import type { ViewerAccount } from '@/types/cws';
import { VIEWER_ACCOUNT_STORAGE_KEY } from '@/config/cats';

const VIEWER_ACCOUNT_REGISTRY_STORAGE_KEY = 'cws.viewerAccounts';

const hasWindow = () => typeof window !== 'undefined';

const safeParse = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const loadViewerAccount = (): ViewerAccount | null => {
  if (!hasWindow()) {
    return null;
  }

  return safeParse<ViewerAccount>(window.localStorage.getItem(VIEWER_ACCOUNT_STORAGE_KEY));
};

export const loadViewerAccounts = (): ViewerAccount[] => {
  if (!hasWindow()) {
    return [];
  }

  return safeParse<ViewerAccount[]>(window.localStorage.getItem(VIEWER_ACCOUNT_REGISTRY_STORAGE_KEY)) ?? [];
};

export const saveViewerAccount = (account: ViewerAccount) => {
  if (!hasWindow()) {
    return;
  }

  const existing = loadViewerAccounts();
  const withoutCurrent = existing.filter((entry) => entry.id !== account.id);
  const nextRegistry = [account, ...withoutCurrent];

  window.localStorage.setItem(VIEWER_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
  window.localStorage.setItem(VIEWER_ACCOUNT_REGISTRY_STORAGE_KEY, JSON.stringify(nextRegistry));
};

export const signInViewerAccount = (accountId: string): ViewerAccount | null => {
  if (!hasWindow()) {
    return null;
  }

  const existing = loadViewerAccounts();
  const matched = existing.find((entry) => entry.id === accountId) ?? null;

  if (!matched) {
    return null;
  }

  window.localStorage.setItem(VIEWER_ACCOUNT_STORAGE_KEY, JSON.stringify(matched));
  return matched;
};

export const clearViewerAccount = () => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(VIEWER_ACCOUNT_STORAGE_KEY);
};

export const createViewerAccountNumber = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CWS-418-${random}`;
};