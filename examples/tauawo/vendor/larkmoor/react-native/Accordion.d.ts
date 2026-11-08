import { type ReactNode } from 'react';
export interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
}
/** Optional detail people can skip. Each header is a button that exposes its expanded state. */
export declare function Accordion({ items, initiallyOpen }: {
    items: AccordionItem[];
    initiallyOpen?: string[];
}): import("react").JSX.Element;
