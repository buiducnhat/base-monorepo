import { create } from "zustand";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsStore = {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
};

export const useBreadcrumbsStore = create<BreadcrumbsStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
