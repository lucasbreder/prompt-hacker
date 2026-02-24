export interface NavItem {
  label: string;
  link_url: string;
  page: {
    id: number;
    slug: string;
  };
}
