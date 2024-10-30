'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link, { LinkProps } from 'next/link';
import React, { createContext, useContext, useState } from 'react';
import Icon, { IconProps } from './icon';

interface Links {
  label: string;
  href: string;
  icon: IconProps['icon'];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          'h-full px-4 py-4 hidden  md:flex md:flex-col w-[300px] flex-shrink-0',
          className
        )}
        animate={{
          width: animate ? (open ? '300px' : '60px') : '300px',
        }}
        // onClick={() => setOpen((prev) => !prev)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  closeTrigger = false,
  ...props
}: {
  link: Links;
  className?: string;
  closeTrigger?: boolean;
  props?: LinkProps;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        'flex items-center justify-start gap-2  group/sidebar py-2',
        className
      )}
      onClick={(evt) => {
        closeTrigger && setOpen((prev) => !prev);
        const clickfun = props && props.props?.onClick;
        clickfun && clickfun(evt);
      }}
      {...props}
    >
      <Icon
        icon={link.icon}
        className='text-neutral-700 dark:text-neutral-200 h-6 w-6 py-0.5 flex-shrink-0 group-hover/sidebar:text-brand-secondary'
      />

      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className='text-neutral-700 dark:text-neutral-200 text-md group-hover/sidebar:translate-x-1 group-hover/sidebar:text-brand-secondary transition duration-150 whitespace-pre inline-block !p-0 !m-0'
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
