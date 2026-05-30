export type MarketplaceItem = {
  slug: string;
  name: string;
  description: string;
  type: string;
  version: string;
  price: string;
  license: string;
  technicalName: string;
  website: string;
  compatibility?: string;
  warning?: string;
  livePreview?: string;
  supportUrl?: string;
  contactEmail?: string;
  image: string;
  link: string;
  downloads?: string;
  upgradeUrl?: string;
  keyFeatures?: string[];
  widgetCoverage?: string[];
  dependencies?: string[];
  coverage?: string[];
  highlights?: string[];
  comparison?: string[];
  screenshots?: string[];
};

export const marketplaceItems: MarketplaceItem[] = [
  {
    slug: "aura-user-dashboard",
    name: "Aura User Dashboard",
    description:
      "A standalone personalized dashboard for Odoo users with summary cards, widgets, and quick actions to accelerate daily work.",
    type: "Module · Productivity",
    version: "19.0",
    price: "$24.74",
    license: "OPL-1",
    technicalName: "aura_user_dashboard",
    website: "https://latitibabu.com",
    compatibility: "Odoo 19 Enterprise Compatible",
    supportUrl: "https://apps.odoo.com/apps/support/315901",
    contactEmail: "support@latitibabu.com",
    image: "https://apps.odoocdn.com/apps/assets/19.0/aura_user_dashboard/aura_user_dashboard_demo.gif?75bead3",
    link: "https://apps.odoo.com/apps/modules/19.0/aura_user_dashboard",
    keyFeatures: [
      "Per-user dashboard configuration with independent settings.",
      "Configurable overview cards in the summary row (4 selectable cards).",
      "Widget-based dashboard with layout controls (position and width).",
      "Quick actions to open records and create documents directly from cards.",
      "Default widget set with restore-to-default capability.",
      "Configurable limits for activities, invoices, pipeline stages, and recent items.",
      "Automatic module-aware widget availability based on installed Odoo apps.",
    ],
    widgetCoverage: [
      "General: Quick Actions, Overview Stats, My Activities, Today's Focus, Continue Working, Activity Trend",
      "Accounting: Top Invoices, Cash Flow Summary, Aged Receivables",
      "CRM: My Pipeline",
      "Sales: Quotations to Send, Orders to Invoice, Sales Trend",
      "Inventory: Products to Reorder, Pending Receipts",
      "Project: My Tasks, Project Deadlines",
      "HR: Leave Requests, Attendance Today",
      "Purchase: RFQs to Send, Open Purchase Orders",
      "Manufacturing: Production Orders",
    ],
    dependencies: [
      "web",
      "mail",
      "account",
      "crm",
      "sale",
      "project",
      "stock",
      "hr_holidays",
      "hr_attendance",
      "purchase",
      "mrp",
    ],
    screenshots: [
      "https://apps.odoocdn.com/apps/assets/19.0/aura_user_dashboard/dashboard_light.png?75bead3",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_user_dashboard/dashboard_dark.png?75bead3",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_user_dashboard/widget_dialog.png?75bead3",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_user_dashboard/setting_dialog.png?75bead3",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_user_dashboard/aura_user_dashboard_demo.gif?75bead3",
    ],
  },
  {
    slug: "aura-backend-theme-community",
    name: "Aura Backend Theme - Community Edition",
    description:
      "Aura turns Odoo Community into a bold, modern workspace with polished screens, configurable branding, focused navigation, and a personal dashboard built around widgets, KPIs, charts, filters, and quick actions.",
    type: "Theme · Backend",
    version: "19.0 (also 18.0)",
    price: "$50.00",
    license: "OPL-1",
    technicalName: "aura_backend_theme",
    website: "https://latitibabu.com",
    livePreview: "https://auratheme.latitibabu.com/",
    warning: "Backend themes might not work with Odoo Enterprise Edition.",
    supportUrl: "https://apps.odoo.com/apps/support/314504",
    contactEmail: "hello@latitibabu.com",
    image: "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/banner_main.png?6852180",
    link: "https://apps.odoo.com/apps/themes/19.0/aura_backend_theme",
    keyFeatures: [
      "Two dashboard experiences: Workspace and Classic layouts per user.",
      "Localization-ready UI with 19 translations and RTL-friendly styling.",
      "Multi-company awareness across dashboard KPIs and widgets.",
      "Cleaner chatter, activity, and search panel styling.",
      "Polished app menu, company switcher, and navigation helpers.",
      "Per-user widgets, KPI cards, quick actions, filters, and saved layouts.",
      "White-label controls for login pages, brand colors, topbar, loading states, and sidebar.",
      "Refined views for kanban, list, form, calendar, inventory, CRM, invoices, HR, and discuss.",
      "Widget builder with KPI styling, JSON config, and layout control (drag, resize, reorder).",
    ],
    coverage: [
      "Sales & CRM: pipeline, quotations, invoices, cash flow, activity views",
      "Inventory: overview, products, receipts, purchase orders, reorder flows",
      "Operations: project tasks, production work, deadlines, status bars, calendar",
      "HR: attendance, leave requests, focus tasks, dashboards",
    ],
    highlights: ["26 included interface features", "0 code needed for setup", "1 personal home dashboard"],
    screenshots: [
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/workspace_dashboard.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/classic_dashboard.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/new_dashboard_screenshot.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/theme_setting_brand.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/login_screen_blue_split.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/custom_widget_creation.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/kpi_card_color_selection.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/widget_json_configuration.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/dashboard_home_menu.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/theme_setting_topbar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/collapsed_sidebar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/menu_submenu.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/list_view_invoicing.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/form_view_invoicing_light_sidebar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/kanban_view_crm.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/kanban_views_products.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/calendar_view_sales.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/status_bar_states.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/inventory_overview_page.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/screenshots/discus_page.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme/img/gifs/home_dashboard_demo.gif?6852180",
    ],
  },
  {
    slug: "aura-backend-theme-enterprise",
    name: "Aura Backend Theme - Enterprise Edition",
    description:
      "Aura turns Odoo Enterprise into a bold, modern workspace with polished screens, configurable branding, focused navigation, and a personal dashboard built around widgets, KPIs, charts, filters, and quick actions.",
    type: "Theme · Backend",
    version: "19.0",
    price: "$50.00",
    license: "OPL-1",
    technicalName: "aura_backend_theme_ent",
    website: "https://latitibabu.com",
    livePreview: "https://auratheme.latitibabu.com/",
    warning: "Requires Odoo Enterprise Edition.",
    supportUrl: "https://apps.odoo.com/apps/support/319335",
    contactEmail: "hello@latitibabu.com",
    image: "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/banner_main.png?6852180",
    link: "https://apps.odoo.com/apps/themes/19.0/aura_backend_theme_ent",
    keyFeatures: [
      "Fully customizable user dashboard with per-user widgets and saved layouts.",
      "White-label controls for login pages, brand colors, topbar, loading states, and sidebar.",
      "Cleaner kanban, list, form, calendar, discuss, inventory, status bar, and app views.",
      "Widget builder with KPI styling, JSON configuration, and layout control.",
    ],
    coverage: [
      "Sales & CRM: pipeline, quotations, invoices, cash flow, activity views",
      "Inventory: overview, products, receipts, purchase orders, reorder flows",
      "Operations: project tasks, production work, deadlines, status bars, calendar",
      "HR: attendance, leave requests, focus tasks, dashboards",
    ],
    highlights: ["26 included interface features", "0 code needed for setup", "1 personal home dashboard"],
    screenshots: [
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/new_dashboard_screenshot.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/theme_setting_brand.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/login_screen_blue_split.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/custom_widget_creation.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/kpi_card_color_selection.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/widget_json_configuration.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/dashboard_home_menu.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/theme_setting_topbar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/collapsed_sidebar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/menu_submenu.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/list_view_invoicing.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/form_view_invoicing_light_sidebar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/kanban_view_crm.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/kanban_views_products.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/calendar_view_sales.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/status_bar_states.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/inventory_overview_page.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/screenshots/discus_page.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_ent/img/gifs/home_dashboard_demo.gif?6852180",
    ],
  },
  {
    slug: "aura-backend-theme-free",
    name: "Aura Backend Theme - Free",
    description:
      "A clean, modern backend theme for Odoo 19 with a polished sidebar, clearer typography, and a branded everyday workspace.",
    type: "Theme · Backend",
    version: "19.0",
    price: "Free",
    license: "LGPL-3",
    technicalName: "aura_backend_theme_free",
    website: "https://latitibabu.com",
    warning: "Backend themes might not work with Odoo Enterprise Edition.",
    supportUrl: "https://apps.odoo.com/apps/support/309881",
    image: "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_free/banner_main.png?6852180",
    link: "https://apps.odoo.com/apps/themes/19.0/aura_backend_theme_free",
    downloads: "103+ downloads",
    upgradeUrl: "https://apps.odoo.com/apps/themes/19.0/aura_backend_theme",
    keyFeatures: ["Modern sidebar", "Cleaner UI", "Responsive layout"],
    comparison: [
      "Core backend visual refresh: Included",
      "Per-user home dashboard system: Not in free package",
      "Widget engine and app widgets: Not in free package",
      "Interactive theme settings dialog: Not in free package",
      "Admin configuration models/settings: Not in free package",
      "Expanded module icon set: Minimal set",
    ],
    screenshots: [
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_free/img/screenshots/form_view_with_theme_sidebar.png?6852180",
      "https://apps.odoocdn.com/apps/assets/19.0/aura_backend_theme_free/img/screenshots/setting_page_with_theme_sidebar.png?6852180",
    ],
  },
];
