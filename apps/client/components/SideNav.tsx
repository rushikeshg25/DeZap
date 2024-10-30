'use client';
import { useState } from 'react';
import { IconProps } from './ui/icon';
import { Sidebar, SidebarBody, SidebarLink } from './ui/sidebar';

const links: { label: string; href: string; icon: IconProps['icon'] }[] = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Transfer',
    href: '/app/transfer',
    icon: 'airdrop',
  },
  {
    label: 'Stream',
    href: '/app/stream',
    icon: 'stream',
  },
  {
    label: 'Spl Token',
    href: '/app/spltoken',
    icon: 'spl-token',
  },
  {
    label: 'NFT',
    href: '/app/nft',
    icon: 'mint-token',
  },
  {
    label: 'Payments',
    href: '/app/payments',
    icon: 'payments',
  },
  {
    label: 'Escrow',
    href: '/app/escrow',
    icon: 'escrow',
  },
  {
    label: 'Services',
    href: '/app/services',
    icon: 'services',
  },
];

export const SideNav = () => {
  const [open, setOpen] = useState(true);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            closeTrigger={true}
            link={{
              label: 'Hide',
              href: '',
              icon: open ? 'hide' : 'show',
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};
