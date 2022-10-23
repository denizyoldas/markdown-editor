import { atom } from 'jotai';

const sidebarAtom = atom({
  key: 'sidebarAtom',
  default: {
    isOpen: false,
  },
});

export default sidebarAtom;
