export const MENUITEM = [
  {
    label: 'Home',
    items: [
      { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
    ],
  },
  {
    label: 'Modules',
    items: [
      {
        label: 'Communities',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/community/list'],
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/events/list'],
      },
      {
        label: 'Decoration Items',
        icon: 'pi pi-fw pi-box',
        routerLink: ['/items'],
      },
      // {
      //   label: 'Work Order',
      //   icon: 'pi pi-fw pi-cart-plus',
      //   items: [

      //     {
      //       label: 'History',
      //       icon: 'pi pi-fw pi-list',
      //       routerLink: ['/work-order/history'],
      //     },
      //     {
      //       label: 'Invoices',
      //       icon: 'pi pi-fw pi-file-pdf',
      //       routerLink: ['/work-order/invoice'],
      //     },
      //   ],
      // },
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-truck',
        items: [
          {
            label: 'Config',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/config'],
          },
          {
            label: 'Gallary',
            icon: 'pi pi-fw pi-file-pdf',
            routerLink: ['/gallary'],
          },
        ],
      },
    ],
  },
  // {
  //   label: 'Resources',
  //   items: [
  //   {
  //     label: 'Earning Summary',
  //     icon: 'pi pi-fw pi-chart-line',
  //     routerLink: ['/summary'],
  //   },
  //   {
  //     label: 'Calender',
  //     icon: 'pi pi-fw pi-calendar',
  //     routerLink: ['/summary/calender'],
  //   },
  //   ],
  // },
];
