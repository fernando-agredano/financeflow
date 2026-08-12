# FinanceFlow

**FinanceFlow** es una aplicación web de finanzas personales construida con **Next.js 16**, **React 19** y **Material UI**, con persistencia 100% local mediante **IndexedDB** (a través de Dexie.js). Permite registrar ingresos y gastos, definir presupuestos mensuales por categoría, visualizar tendencias con gráficas, y exportar reportes en CSV y PDF con un diseño formal tipo estado de cuenta.

No requiere backend, base de datos remota ni autenticación: todos los datos viven en el navegador del usuario.

---

## Tabla de contenidos

- [Vista previa](#vista-previa)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
  - [Modelo de datos y persistencia](#modelo-de-datos-y-persistencia)
  - [Estructura de carpetas](#estructura-de-carpetas)
  - [Capas de la aplicación](#capas-de-la-aplicación)
  - [Gestión de estado global](#gestión-de-estado-global)
  - [Sistema de diseño (theming)](#sistema-de-diseño-theming)
  - [Layout shell: Sidebar + Navbar](#layout-shell-sidebar--navbar)
  - [Exportación a PDF](#exportación-a-pdf)
  - [Diseño responsivo](#diseño-responsivo)
- [Páginas de la aplicación](#páginas-de-la-aplicación)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts disponibles](#scripts-disponibles)
- [Categorías predefinidas](#categorías-predefinidas)
- [Decisiones de diseño y limitaciones conocidas](#decisiones-de-diseño-y-limitaciones-conocidas)

---

## Vista previa

| Desktop | Mobile |
| --- | --- |
| ![Dashboard en escritorio](docs/screenshots/preview-desktop.png) | ![Dashboard en móvil](docs/screenshots/preview-mobile.png) |

El layout es completamente responsivo: el sidebar de navegación es persistente y retráctil en escritorio, y se convierte en un drawer deslizable en móvil; las tablas se reorganizan en tarjetas apiladas y las grillas de tarjetas pasan de 4 columnas a 1–2 según el ancho disponible.

---

## Características principales

- **Dashboard** con tarjetas resumen (ingresos, gastos, balance, tasa de ahorro), gráfica de tendencia de 6 meses, distribución de gastos por categoría, movimientos recientes y progreso de presupuestos del mes — todo en una sola vista.
- **Movimientos**: alta de ingresos/gastos con validación (Zod + React Hook Form), filtros por tipo/categoría/rango de fechas/texto, tabla paginada (12 registros por página) sin scroll de página.
- **Presupuestos**: límites mensuales por categoría con barra de progreso, estado "excedido"/"cerca del límite", y alta con modal de confirmación.
- **Reportes**: tendencia de 6 meses, distribución de gastos y top 5 categorías de gasto.
- **Exportación**:
  - **CSV** plano, listo para abrir en Excel/Sheets.
  - **PDF formal tipo estado de cuenta**, generado 100% en el cliente con `jsPDF` + `jspdf-autotable`: membrete con folio y fecha de emisión, resumen, dos gráficas vectoriales (tendencia mensual y top categorías dibujadas a mano con primitivas de `jsPDF`, sin capturas de pantalla), tabla de detalle paginada automáticamente y total final estilo factura.
- **Modales de confirmación** antes de guardar un movimiento o presupuesto, con un resumen coloreado (verde/rojo/azul) de lo que se va a guardar.
- **Toasts dinámicos** (Snackbar + Alert de MUI, tematizados) que confirman la acción con el detalle del movimiento/presupuesto agregado.
- **Selector de mes global** (Context de React) que filtra Dashboard, Presupuestos y Reportes de forma sincronizada.
- **Sidebar retráctil** con transición fluida, iconos que nunca se desplazan al colapsar/expandir, y persistencia de la preferencia en `localStorage`.
- **Sin scroll de página**: el shell de la aplicación ocupa exactamente el alto del viewport; el contenido que no cabe se desplaza dentro de su propio contenedor, nunca en la ventana.
- **Tema visual propio**: paleta cálida (crema/navy/dorado), sin los patrones genéricos de Material UI por defecto — colores, tipografía, radios y sombras centralizados en un único archivo de tema.

---

## Stack tecnológico

| Categoría | Tecnología | Uso |
| --- | --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Enrutamiento y build |
| UI | [React 19](https://react.dev/) | Componentes |
| Librería de componentes | [MUI 9](https://mui.com/) (`@mui/material`, `@mui/icons-material`) | Sistema de diseño base |
| Estilos | Emotion (motor de estilos de MUI) | CSS-in-JS |
| Persistencia | [Dexie.js](https://dexie.org/) sobre IndexedDB | Base de datos local en el navegador |
| Formularios | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (`@hookform/resolvers`) | Validación de formularios |
| Gráficas (UI) | [Recharts](https://recharts.org/) | Barras y dona en el Dashboard/Reportes |
| Exportación | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Generación de PDF en el cliente |
| Fechas | [date-fns](https://date-fns.org/) | Utilidades de fecha (dependencia disponible; formateo principal vía `Intl`) |
| Lenguaje | TypeScript 5 (`strict: true`) | Tipado estático |
| Linting | ESLint 9 (`eslint-config-next`) | Calidad de código |

---

## Arquitectura

### Modelo de datos y persistencia

FinanceFlow **no tiene backend**. Toda la información se guarda directamente en el navegador usando **IndexedDB**, envuelta por Dexie.js para dar una API tipo ORM con consultas reactivas.

```ts
// src/lib/db.ts
class FinanceDB extends Dexie {
  transactions!: Table<Transaction, number>
  budgets!: Table<Budget, number>
}
```

Las consultas se consumen mediante `dexie-react-hooks` (`useLiveQuery`), lo que significa que **cualquier cambio en la base de datos re-renderiza automáticamente** a todos los componentes suscritos, sin necesidad de un store global tipo Redux/Zustand. Esto es lo que permite, por ejemplo, que al agregar un movimiento el Dashboard, los Reportes y la tabla de Movimientos se actualicen todos al instante.

Al iniciar la app por primera vez (`Providers.tsx` → `seedIfEmpty()`), la base de datos se puebla con datos de ejemplo (movimientos y presupuestos del mes actual y anterior) para que el usuario vea la app funcionando sin pasos previos.

**Entidades:**

```ts
type TransactionType = 'income' | 'expense'

interface Transaction {
  id?: number
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  date: string        // 'YYYY-MM-DD'
  notes?: string
  createdAt: string    // ISO timestamp
}

interface Budget {
  id?: number
  categoryId: string
  limit: number
  month: string        // 'YYYY-MM'
}

interface Category {
  id: string
  name: string
  type: TransactionType
  icon: string
  color: string
}
```

La validación de entrada (formularios) se hace con esquemas de **Zod** (`src/lib/schemas.ts`), incluyendo coerción de tipos (`z.coerce.number()`) para que los inputs HTML —que siempre entregan strings— se conviertan a número de forma segura antes de guardarse.

### Estructura de carpetas

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Shell raíz: Sidebar + Navbar + <main>, providers globales
│   ├── page.tsx                # Dashboard ("/")
│   ├── globals.css             # Reset + bloqueo de scroll de ventana
│   ├── transactions/page.tsx   # Movimientos (tabla paginada, filtros, export CSV/PDF)
│   ├── budgets/page.tsx        # Presupuestos (alta + tarjetas de progreso)
│   └── reports/page.tsx        # Reportes (tendencias y top categorías)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Nav lateral retráctil (desktop) + Drawer (mobile)
│   │   ├── Navbar.tsx           # Header: menú móvil, selector de mes, botón "Agregar"
│   │   ├── BrandMark.tsx        # Logo/wordmark reutilizable (monograma "F")
│   │   └── Providers.tsx        # ThemeProvider + ToastProvider + MonthProvider + seed de datos
│   ├── dashboard/
│   │   ├── SummaryCards.tsx     # 4 tarjetas: ingresos, gastos, balance, tasa de ahorro
│   │   ├── RecentTransactions.tsx
│   │   └── BudgetProgress.tsx
│   ├── charts/
│   │   ├── MonthlyBarChart.tsx  # Recharts: barras ingresos vs gastos
│   │   └── CategoryPieChart.tsx # Recharts: dona de gastos por categoría
│   ├── transactions/
│   │   ├── TransactionForm.tsx  # Formulario + flujo de confirmación + toast
│   │   └── TransactionModal.tsx # Dialog contenedor del formulario
│   └── common/
│       └── ConfirmDialog.tsx     # Modal de confirmación genérico y reutilizable
│
├── hooks/
│   ├── useFinance.ts            # Queries reactivas (Dexie) + acciones CRUD
│   ├── useMonth.tsx             # Context: mes seleccionado, compartido en toda la app
│   └── useToast.tsx             # Context: sistema de notificaciones (Snackbar/Alert)
│
├── lib/
│   ├── db.ts                    # Definición de la base de datos Dexie + seed
│   ├── finance.ts               # Categorías, formatters, exportToCSV, exportToPDF
│   ├── schemas.ts                # Esquemas Zod (transacción, presupuesto)
│   └── theme.ts                  # Tema de MUI centralizado (paleta, tipografía, overrides)
│
└── types/
    └── finance.ts                # Tipos compartidos (Transaction, Budget, Category, ...)
```

### Capas de la aplicación

```
┌─────────────────────────────────────────────────────────┐
│  Páginas (app/*)                                         │
│  Orquestan hooks + componentes, sin lógica de negocio     │
└───────────────┬───────────────────────────┬───────────────┘
                │                           │
┌───────────────▼───────────────┐ ┌─────────▼─────────────┐
│  Componentes (components/*)    │ │  Hooks (hooks/*)        │
│  Presentación + interacción     │ │  Estado + acceso a datos│
└───────────────┬───────────────┘ └─────────┬─────────────┘
                │                           │
┌───────────────▼───────────────────────────▼───────────────┐
│  lib/finance.ts, lib/schemas.ts                            │
│  Reglas de negocio: formatos, validación, export            │
└───────────────┬─────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────┐
│  lib/db.ts (Dexie) → IndexedDB del navegador                 │
└───────────────────────────────────────────────────────────────┘
```

No existe una capa de API/red: cada página llama directamente a los hooks de `useFinance.ts`, que a su vez leen/escriben en Dexie. Esto simplifica enormemente el flujo de datos a costa de que la información no se sincroniza entre dispositivos (ver [limitaciones conocidas](#decisiones-de-diseño-y-limitaciones-conocidas)).

### Gestión de estado global

En vez de una librería de estado (Redux, Zustand, etc.), la app usa **dos Contexts de React**, cada uno con una responsabilidad puntual:

| Context | Archivo | Responsabilidad |
| --- | --- | --- |
| `MonthProvider` / `useMonth()` | `hooks/useMonth.tsx` | Mes seleccionado en el Navbar; consumido por Dashboard, Presupuestos y Reportes para filtrar sus datos de forma sincronizada. |
| `ToastProvider` / `useToast()` | `hooks/useToast.tsx` | Cola de notificaciones tipo Snackbar; expone `showToast({ message, description, severity })` a cualquier componente. |

Ambos se montan una sola vez en `components/layout/Providers.tsx`, envolviendo toda la aplicación:

```tsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  <ToastProvider>
    <MonthProvider>{children}</MonthProvider>
  </ToastProvider>
</ThemeProvider>
```

El resto del estado (filtros de la tabla de movimientos, paginación, formularios, estado de apertura de modales) es local a cada componente vía `useState`, ya que no necesita compartirse entre pantallas.

### Sistema de diseño (theming)

Todo el look & feel vive en **un único archivo**, `src/lib/theme.ts`, que extiende el tema por defecto de MUI (`createTheme`) con:

- **Paleta propia** (crema/navy/dorado) en vez de los azules/morados por defecto de MUI:

  | Token | Color | Uso |
  | --- | --- | --- |
  | `primary` | `#1B3A6B` (navy) | Marca, botones principales, acentos |
  | `background.default` | `#F5F0E8` (crema) | Fondo de la app |
  | `background.paper` | `#FEFCF8` | Tarjetas, diálogos |
  | `success` | `#1A6B45` | Ingresos, confirmaciones |
  | `error` | `#8B2020` | Gastos, errores |
  | `divider` | `#DDD8CE` | Bordes sutiles |

- **`styleOverrides` por componente** (`MuiCard`, `MuiButton`, `MuiChip`, `MuiDialog`, `MuiAlert`, etc.) para que cada instancia de un componente de MUI en toda la app comparta radios de borde, sombras y tipografía sin repetir `sx` en cada uso.
- **Tipografía**: Inter (vía `next/font/google`) con pesos y `letter-spacing` ajustados para que se sienta como un producto propio, no una plantilla genérica.

Este enfoque centralizado es lo que permitió, por ejemplo, estandarizar de un solo cambio el tamaño de fuente de todos los inputs (`MuiInputBase`) cuando se detectó inconsistencia entre páginas.

### Layout shell: Sidebar + Navbar

El shell de la aplicación (`app/layout.tsx`) arma una estructura de **altura fija igual al viewport**, sin scroll de ventana:

```
┌──────────┬──────────────────────────────┐
│          │  Navbar (58px, sticky)        │
│ Sidebar  ├──────────────────────────────┤
│ (persist.│                                │
│  md+ /   │  <main> — flex:1               │
│  drawer  │  overflow-y: auto              │
│  en xs)  │  (contenido de cada página)    │
│          │                                │
└──────────┴──────────────────────────────┘
```

- **Sidebar** (`Sidebar.tsx`): persistente en `md+`, retráctil (232px ↔ 76px) con una transición de `width` — los íconos viven en un **slot de tamaño fijo** que nunca cambia entre estados, así que solo el texto aparece/desaparece con opacidad; nada "salta". En móvil se oculta y se reemplaza por un `Drawer` temporal disparado desde el ícono de menú del Navbar. El estado colapsado/expandido persiste en `localStorage`.
- **Navbar** (`Navbar.tsx`): sticky, con el selector de mes global y el botón "Agregar movimiento". En móvil se compacta (oculta el texto de marca, angosta el selector, deja el botón de agregar como solo-ícono) para no desbordar pantallas pequeñas.
- **`<main>`**: es el **único contenedor con scroll** de toda la app (`overflow-y: auto`, `flex: 1`, `min-height: 0`). El `<body>` y el `<html>` tienen `overflow: hidden` — de ahí que la app nunca "rebote" ni muestre franjas en blanco al hacer scroll con trackpad.
- La página de **Movimientos** además fija su propia altura a `calc(100vh - 58px)` y pagina la tabla (12 filas), así ni siquiera su contenedor interno necesita scroll en el caso normal.

### Exportación a PDF

`exportToPDF()` (en `lib/finance.ts`) genera un PDF **completamente en el navegador**, sin llamadas a un servidor, usando `jsPDF` para dibujar directamente con primitivas vectoriales (rectángulos, líneas, texto) y `jspdf-autotable` para la tabla de detalle. El documento sigue un formato de **estado de cuenta / factura**:

1. Membrete con marca, folio autogenerado (`FF-YYYYMMDD-HHMM`) y fecha de emisión.
2. Franja de metadatos: periodo cubierto, número de movimientos, saldo neto.
3. Resumen con bordes finos: ingresos / gastos / balance.
4. **Dos gráficas dibujadas a mano** (sin capturar pantalla ni convertir imágenes): barras agrupadas de ingresos vs. gastos por mes, y barras horizontales del top 5 de categorías de gasto — usando los mismos colores de categoría que la UI.
5. Tabla de detalle con paginación automática entre hojas.
6. Total final estilo factura (ingresos, gastos, balance) en la última página.
7. Pie de página con "Página X de Y" en cada hoja.

`exportToCSV()` genera, en cambio, un CSV plano con BOM UTF-8 para abrir correctamente acentos en Excel.

### Diseño responsivo

Breakpoints de MUI usados: `xs` (<600px, móvil), `sm` (600–900px), `md` (≥900px, donde aparece el sidebar persistente). Patrones aplicados de forma consistente en toda la app:

- **Grids de tarjetas** (`SummaryCards`, tarjetas de Dashboard, Presupuestos, Reportes) pasan de 4/2 columnas a 1 columna apilada en móvil mediante `gridTemplateColumns` responsivo.
- **Tabla → tarjetas**: la tabla de Movimientos, con columnas de ancho fijo en píxeles, se reemplaza en móvil por tarjetas apiladas (descripción + monto arriba, categoría + fecha + eliminar abajo) en vez de comprimir columnas ilegibles.
- **Formularios de filtros/alta** envuelven (`flexWrap`) y sus campos pasan a ancho completo en pantallas pequeñas.
- **Diálogos** reducen su margen respecto al viewport en móvil para aprovechar mejor el espacio.

---

## Páginas de la aplicación

| Ruta | Página | Descripción |
| --- | --- | --- |
| `/` | Dashboard | Resumen del mes: tarjetas de KPIs, tendencia de 6 meses, distribución por categoría, movimientos recientes y progreso de presupuestos. |
| `/transactions` | Movimientos | Alta, filtrado, paginación y exportación (CSV/PDF) de todos los movimientos. |
| `/budgets` | Presupuestos | Definición de límites mensuales por categoría de gasto y seguimiento visual del consumo. |
| `/reports` | Reportes | Tendencia de 6 meses, distribución de gastos y top 5 categorías con porcentaje del total. |

---

## Puesta en marcha

### Requisitos

- Node.js 20 o superior
- npm (el proyecto incluye `package-lock.json`)

### Instalación

```bash
git clone <url-del-repositorio>
cd financeflow
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El proyecto usa **Turbopack** como bundler de desarrollo (incluido en Next.js 16).

### Producción

```bash
npm run build
npm run start
```

---

## Scripts disponibles

| Script | Comando | Descripción |
| --- | --- | --- |
| `dev` | `next dev` | Servidor de desarrollo con hot-reload (Turbopack) |
| `build` | `next build` | Build de producción |
| `start` | `next start` | Sirve el build de producción |
| `lint` | `eslint` | Linting del proyecto |

> El proyecto usa TypeScript en modo `strict`. Se recomienda correr `npx tsc --noEmit` antes de subir cambios grandes, ya que no hay un script `typecheck` dedicado.

---

## Categorías predefinidas

Definidas en `src/lib/finance.ts` (`CATEGORIES`), cada una con su propio color usado consistentemente en gráficas, chips y el PDF:

**Ingresos:** Trabajo, Inversiones, Freelance, Otros ingresos
**Gastos:** Vivienda, Alimentación, Transporte, Entretenimiento, Salud, Educación, Ropa, Otros gastos

---

## Decisiones de diseño y limitaciones conocidas

- **Sin backend ni sincronización**: al vivir en IndexedDB, los datos son locales al navegador/dispositivo. Borrar datos del sitio o cambiar de navegador implica perder la información (no hay exportación/importación de la base completa, solo de reportes).
- **Sin autenticación**: la app está pensada para uso personal en un solo dispositivo, no multiusuario.
- **Un solo idioma** (español, `es-MX`) y una sola moneda (MXN) en los formatters de `lib/finance.ts`.
- **Persistencia parcial de preferencias**: solo el estado colapsado/expandido del sidebar se guarda en `localStorage`; el mes seleccionado y los filtros se reinician al recargar la página.
