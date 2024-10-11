import {
  DashboardOutlined,
  CalendarMonthOutlined,
  LibraryBooksOutlined,
} from '@mui/icons-material';
const MenuItems = [
  {
    label: 'Screen Manager',
    path: '/dashboard/screens',
    icon: DashboardOutlined,
  },
  {
    label: 'Content Manager',
    path: '/dashboard/content',
    icon: LibraryBooksOutlined,
  },
  {
    label: 'Events',
    path: '/dashboard/events',
    icon: CalendarMonthOutlined,
  },
];

export default MenuItems;
