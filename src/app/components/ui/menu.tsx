'use client';

import { Menu as MenuPrimitive } from '@base-ui/react/menu';

import { cn } from '@/lib/utils';

const Menu = MenuPrimitive.Root;

function MenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot='menu-trigger'
      className={cn('outline-none', className)}
      {...props}
    />
  );
}

/**
 * Little pointer that ties the popup to its trigger. The rotated square only
 * paints the two edges facing away from the popup, so the seam stays invisible.
 */
function MenuArrow({ className, ...props }: MenuPrimitive.Arrow.Props) {
  return (
    <MenuPrimitive.Arrow
      data-slot='menu-arrow'
      className={cn(
        'group data-[side=bottom]:top-[-7px] data-[side=left]:right-[-7px] data-[side=right]:left-[-7px] data-[side=top]:bottom-[-7px]',
        className,
      )}
      {...props}
    >
      <span className='block size-3.5 rotate-45 rounded-tl-[3px] bg-white group-data-[side=bottom]:border-t group-data-[side=bottom]:border-l group-data-[side=left]:border-t group-data-[side=left]:border-r group-data-[side=right]:border-b group-data-[side=right]:border-l group-data-[side=top]:border-r group-data-[side=top]:border-b border-heading/10' />
    </MenuPrimitive.Arrow>
  );
}

function MenuContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 12,
  align = 'center',
  alignOffset = 0,
  collisionPadding = 12,
  arrow = true,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'collisionPadding'
  > & {
    /** Renders the pointer aimed at the trigger. */
    arrow?: boolean;
  }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className='isolate z-50'
      >
        <MenuPrimitive.Popup
          data-slot='menu-content'
          className={cn(
            'min-w-40 max-w-[calc(100vw-1.5rem)] origin-(--transform-origin) scale-100 rounded-2xl bg-white p-1.5 opacity-100 shadow-popover ring-1 ring-heading/10 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95',
            className,
          )}
          {...props}
        >
          {arrow && <MenuArrow />}
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function MenuGroup({ className, ...props }: MenuPrimitive.Group.Props) {
  return (
    <MenuPrimitive.Group
      data-slot='menu-group'
      className={cn('flex flex-col', className)}
      {...props}
    />
  );
}

function MenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot='menu-label'
      className={cn('px-4 py-1.5 text-xs font-medium text-muted', className)}
      {...props}
    />
  );
}

function MenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return (
    <MenuPrimitive.Item
      data-slot='menu-item'
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-medium text-heading transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-60 data-highlighted:bg-surface [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function MenuSeparator({ className, ...props }: React.ComponentProps<'hr'>) {
  return (
    <hr
      data-slot='menu-separator'
      className={cn('mx-2 my-1.5 h-px border-0 bg-input', className)}
      {...props}
    />
  );
}

export {
  Menu,
  MenuArrow,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
};
