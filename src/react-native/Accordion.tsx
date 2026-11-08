import { useState, type ReactNode } from 'react';
import { LayoutAnimation, Pressable, View } from 'react-native';
import { useLarkmoor } from './theme';
import { Text } from './Text';

export interface AccordionItem { id: string; title: string; content: ReactNode }

/** Optional detail people can skip. Each header is a button that exposes its expanded state. */
export function Accordion({ items, initiallyOpen = [] }: { items: AccordionItem[]; initiallyOpen?: string[] }) {
  const lm = useLarkmoor();
  const [open, setOpen] = useState<string[]>(initiallyOpen);
  const toggle = (id: string) => {
    if (!lm.reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.create(lm.tokens.motion.duration.base, 'easeInEaseOut', 'opacity'));
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  };
  const line = { borderColor: lm.colors['border-strong'].rgba };
  return (
    <View style={[{ borderTopWidth: 1 }, line]}>
      {items.map((it) => {
        const expanded = open.includes(it.id);
        return (
          <View key={it.id} style={[{ borderBottomWidth: 1 }, line]}>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => toggle(it.id)}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: lm.tokens.space['5'], minHeight: lm.target, paddingVertical: lm.tokens.space['4'] }}>
              <Text variant="body" style={{ flex: 1, fontWeight: '500' }}>{it.title}</Text>
              <Text variant="body" tone="muted" accessibilityElementsHidden importantForAccessibility="no" style={{ transform: [{ rotate: expanded ? '45deg' : '0deg' }] }}>+</Text>
            </Pressable>
            {expanded ? <View style={{ paddingBottom: lm.tokens.space['5'] }}>{typeof it.content === 'string' ? <Text variant="body" tone="secondary">{it.content}</Text> : it.content}</View> : null}
          </View>
        );
      })}
    </View>
  );
}
