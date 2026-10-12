# Liquid Monet React

Libreria React riutilizzabile per Next.js, ispirata a Liquid Monet SDK Kotlin.
Questa prima versione usa CSS e `backdrop-filter`: trasparenza, sfocatura, saturazione,
riflessi e bordi luminosi. La rifrazione fisica Snell e gli shader nativi della SDK
non sono ancora implementati nel renderer web.

## Uso

Importa lo stile nel layout Next.js:

```tsx
import "@anto426/liquid-monet-react/styles.css";
```

Usa i componenti in un Client Component:

```tsx
"use client";
import {
  LiquidProvider,
  LiquidBackground,
  LiquidCard,
  LiquidButton,
} from "@anto426/liquid-monet-react";

export function Example() {
  return (
    <LiquidProvider
      defaultPreset="sapphire"
      defaultMode="system"
      storageKey="my-theme"
    >
      <LiquidBackground />
      <LiquidCard>
        <h2>La tua idea</h2>
        <LiquidButton variant="primary">Scopri</LiquidButton>
      </LiquidCard>
    </LiquidProvider>
  );
}
```

`LiquidProvider` accetta `defaultMode` (`light`, `dark`, `system`), `defaultPreset`
(`sapphire`, `emerald`, `sunset`, `violet`) e `storageKey` facoltativo. Con
`useLiquidTheme()` puoi leggere e cambiare preset e modalità.

Esportazioni: `LiquidProvider`, `LiquidBackground`, `LiquidCard`, `LiquidNavigationBar`,
`LiquidButton`, `LiquidLink`, `LiquidBadge`, `LiquidChip`, `LiquidInput`,
`LiquidSearchBar`, `LiquidSelect`, `LiquidSwitch`, `LiquidDialog`, `useLiquidTheme`,
`liquidPresets`, `liquidTokens`.

I componenti inoltrano attributi HTML e `className`. Puoi regolare il materiale con
`--lm-surface`, `--lm-glass-blur`, `--lm-sheen`, `--lm-edge` sul provider o sulla
singola superficie. Il vetro deve avere una scena dietro: su uno sfondo uniforme
la sola trasparenza risulta meno evidente. Il fallback senza `backdrop-filter`
mantiene leggibilità con una superficie più opaca.

Pulsanti, campi e switch usano semantica nativa. Il dialogo usa `showModal()`;
gli effetti rispettano `prefers-reduced-motion`. I colori sono quattro preset
ispirati a Monet, non l'intero algoritmo Material Color Utilities.

## Riutilizzo in un altro progetto

Dalla cartella di questa repository:

```sh
npm install
npm run build
npm pack
```

Installa il `.tgz` risultante nel progetto destinatario con `npm install percorso/pacchetto.tgz`.
Il pacchetto contiene JavaScript compilato, dichiarazioni TypeScript, CSS e licenza.
React e React DOM sono peer dependencies; la libreria non dipende da Next.js.
Non è stata pubblicata su npm.

