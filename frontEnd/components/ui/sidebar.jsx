"use client";
import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { cn } from "cn";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PanelLeftIcon } from "lucide-react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style,
        }}
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col gap-100 bg-sidebar text-sidebar-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          dir={dir}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
          }}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex  gap-3 p-2 text-2xl mt-3", className)}
      {...props}
    >
      <svg
        width="36"
        height="30"
        viewBox="0 0 36 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Screenshot 2024-12-17 at 18.02.18 1 (Traced)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7996 0.189376C16.614 0.374842 16.6072 0.415061 16.6246 1.2258C16.6345 1.68966 16.6109 2.10089 16.5721 2.1395C16.5333 2.17811 16.1224 2.26498 15.6589 2.33239C13.6267 2.62825 11.9182 3.22433 10.1049 4.27026C8.79564 5.02545 8.08594 5.5568 7.01375 6.58457C5.90531 7.64711 5.17363 8.57368 4.23113 10.1085C3.96048 10.5494 3.44001 11.5811 3.44001 11.6769C3.44001 11.6966 3.35513 11.8983 3.2514 12.1251C2.66788 13.4009 2.14879 15.7562 2.13002 17.2133C2.11707 18.221 2.15729 18.1777 1.14883 18.2699C0.384977 18.3398 0.263937 18.3706 0.136922 18.5274C-0.0627173 18.7739 -0.0434123 19.0425 0.1907 19.2766C0.387045 19.4729 0.396315 19.4742 1.24405 19.4245C1.7145 19.3969 3.13358 19.3236 4.3976 19.2616C5.66162 19.1995 7.29911 19.1146 8.03646 19.0727C10.1539 18.9528 10.6898 18.9251 11.7519 18.8815C12.7965 18.8386 14.7168 18.7368 16.8463 18.6115C17.5415 18.5705 18.6126 18.5189 19.2264 18.4968C19.8401 18.4747 20.6158 18.4412 20.95 18.4225C21.2843 18.4038 22.385 18.352 23.3963 18.3074C24.4075 18.2629 25.7864 18.1938 26.4606 18.1539C27.1347 18.114 28.0827 18.0616 28.5673 18.0374C29.0518 18.0132 29.6551 17.9786 29.9079 17.9605C30.1607 17.9424 30.7985 17.9076 31.3251 17.8831C34.7595 17.7236 35.6852 17.6458 35.8426 17.5033C36.0484 17.317 36.0534 16.8471 35.8515 16.6644C35.7278 16.5524 35.5719 16.5347 34.8564 16.5511C34.3898 16.5619 33.9828 16.5455 33.952 16.5147C33.9212 16.4839 33.8381 16.0727 33.7673 15.601C33.6237 14.6433 33.5955 14.5079 33.4379 14.0155C33.3771 13.8259 33.2873 13.5156 33.2382 13.326C33.189 13.1364 33.1177 12.9215 33.0797 12.8483C33.0416 12.7751 33.0105 12.6762 33.0105 12.6287C33.0105 12.4491 32.2817 10.8248 31.9005 10.1547C31.3958 9.26775 30.9517 8.58487 30.7228 8.34386C30.6242 8.23998 30.4525 8.03437 30.3413 7.8869C29.8704 7.26239 28.9125 6.30526 28.1298 5.67715C27.5216 5.18901 25.8426 4.08356 25.3497 3.84669C23.1752 2.80177 21.1423 2.26582 18.9658 2.16378C18.279 2.13153 17.9505 2.08549 17.8759 2.01095C17.8116 1.9466 17.7667 1.7308 17.7628 1.46734C17.7481 0.475505 17.7262 0.317617 17.5814 0.157584C17.3807 -0.0641951 17.0392 -0.0503291 16.7996 0.189376ZM10.7161 5.68443C10.7152 5.73714 10.5686 6.00917 10.3905 6.28909C9.90162 7.05708 8.95598 8.833 8.95582 8.98346C8.95575 9.01778 8.86956 9.23427 8.76423 9.46455C8.65889 9.69483 8.57271 9.92703 8.57271 9.98058C8.57271 10.0341 8.54069 10.1107 8.50154 10.1506C8.39827 10.2562 7.91457 12.1686 7.77591 13.0196C7.65687 13.7497 7.61343 14.1845 7.53874 15.3944C7.4724 16.468 7.27605 16.6167 5.89765 16.6377C4.82844 16.654 4.6334 16.572 4.43996 16.0245C4.29633 15.618 4.39553 15.0823 4.897 13.5559C5.30831 12.304 5.39664 12.0834 5.83215 11.2193C6.52476 9.84521 7.1282 8.92569 8.04419 7.84859C9.28378 6.39098 10.7239 5.22448 10.7161 5.68443ZM21.3279 21.0418C20.0597 21.0724 16.6825 21.2269 14.9694 21.3326C13.573 21.4188 12.9509 21.4535 10.8709 21.5615C9.67011 21.6238 8.27394 21.7083 7.76833 21.7494C7.26272 21.7905 5.86655 21.8621 4.66573 21.9086C3.4649 21.9552 2.43484 22.0087 2.37677 22.0276C2.26814 22.063 2.27603 22.1881 2.43706 22.9786C2.55603 23.563 2.89479 24.6808 3.05842 25.029C3.144 25.211 3.26933 25.5049 3.33689 25.6823C3.68201 26.5873 4.42051 27.8677 5.08569 28.7144C5.28847 28.9726 5.46007 29.1838 5.46704 29.1838C5.47401 29.1838 5.6499 29.1019 5.85797 29.0018C6.9199 28.4911 7.41931 28.2685 7.75538 28.156C8.84313 27.7923 10.6613 27.5569 11.9016 27.6193C13.0552 27.6773 19.1029 27.6755 19.9489 27.6168C20.8339 27.5556 21.3544 27.4508 21.8641 27.2317C22.0326 27.1592 22.5497 26.945 23.0132 26.7558C23.4767 26.5666 23.8904 26.3844 23.9325 26.3509C23.9746 26.3174 24.4125 26.1151 24.9056 25.9013C25.3985 25.6875 25.8639 25.4785 25.9398 25.4369C26.1046 25.3464 26.7031 25.0749 28.1459 24.4362C28.7358 24.175 29.3908 23.8801 29.6015 23.7807C29.8121 23.6813 30.1913 23.5082 30.4441 23.3959C30.9494 23.1716 31.5685 22.8852 32.5271 22.4323C32.8722 22.2693 33.176 22.1359 33.2023 22.1359C33.3114 22.1359 34.0727 21.7548 34.1216 21.6758C34.1508 21.6286 34.1109 21.5184 34.0331 21.431C33.6878 21.0433 33.0148 20.9649 32.1243 21.2088C31.3567 21.419 30.3156 21.7408 30.1377 21.8229C30.0534 21.8618 29.7087 21.9821 29.3716 22.0902C28.435 22.3907 26.3777 23.1102 26.0973 23.2354C25.96 23.2967 25.6753 23.405 25.4647 23.4762C25.254 23.5473 24.7369 23.7255 24.3155 23.8722C23.4751 24.1648 20.8901 24.7179 20.019 24.7916C19.3457 24.8486 19.1069 24.7946 18.9464 24.5496C18.6687 24.1258 18.8766 23.5401 19.3728 23.3487C19.639 23.246 20.7345 23.0583 21.0775 23.0566C21.3624 23.0552 23.1116 22.7759 24.1983 22.5581C24.9659 22.4045 25.5385 22.109 25.6908 21.7881C25.8397 21.4743 25.839 21.4096 25.6839 21.1729L25.5585 20.9815L23.7879 21.0032C22.8141 21.0153 21.7071 21.0326 21.3279 21.0418Z"
          fill="#EF4444"
        />
      </svg>
      Food Delivery
    </div>
  );
}

function SidebarFooter({ className, ...props }) {
  return (
    <div
      dataSlot="sidebar-footer"
      dataSidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }) {
  return (
    <Separator
      dataSlot="sidebar-separator"
      dataSidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }) {
  return (
    <div
      dataSlot="sidebar-content"
      dataSidebar="content"
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden mt-5 ml-3",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }) {
  return (
    <div
      dataSlot="sidebar-group"
      dataSidebar="group"
      className={cn("relative flex w-full min-w-0 gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, render, ...props }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps(
      {
        className: cn(
          "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-group-label",
      sidebar: "group-label",
    },
  });
}

function SidebarGroupAction({ className, render, ...props }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps(
      {
        className: cn(
          "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-group-action",
      sidebar: "group-action",
    },
  });
}

function SidebarGroupContent({ className, ...props }) {
  return (
    <div
      dataSlot="sidebar-group-content"
      dataSidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }) {
  return (
    <ul
      dataSlot="sidebar-menu"
      dataSidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-0", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const { isMobile, state } = useSidebar();
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props,
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active: isActive,
    },
  });

  if (!tooltip) {
    return comp;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps(
      {
        className: cn(
          "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  });
}

function SidebarMenuBadge({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
  // Random width between 50 to 90%.
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  });

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{
          "--skeleton-width": width,
        }}
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      {
        className: cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active: isActive,
    },
  });
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
