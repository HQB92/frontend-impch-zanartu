# Frontend IMPCH Zañartu v2

Proyecto frontend moderno para IMPCH Zañartu construido con Next.js 16, TypeScript, Tailwind CSS y shadcn/ui.

## 🚀 Tecnologías

- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **shadcn/ui** - Componentes UI modernos
- **Apollo Client** - Cliente GraphQL
- **GraphQL** - API de consultas

## 📦 Instalación

```bash
npm install
# o
pnpm install
# o
yarn install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:
```env
NEXT_PUBLIC_URL=https://app.impchzanartu.online
NEXT_PUBLIC_PATCHGRAPHQL=/graphql
NEXT_PUBLIC_TOKEN=your_token_here
```

## 🏃 Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
frontend-impch-zanartu-v2/
├── app/                    # App Router de Next.js
│   ├── login/             # Página de login (shadcn login-04)
│   ├── dashboard/         # Dashboard (shadcn dashboard-01)
│   └── layout.tsx         # Layout principal con ApolloProvider
├── components/            # Componentes React
│   ├── ui/               # Componentes UI de shadcn
│   └── providers/        # Providers (Apollo, etc.)
├── lib/                  # Utilidades y configuraciones
│   ├── apollo-client.ts  # Configuración de Apollo Client
│   └── utils.ts          # Utilidades generales
├── services/             # Servicios y lógica de negocio
│   ├── graphql/         # Archivos GraphQL
│   │   ├── query/       # Queries GraphQL
│   │   └── mutation/    # Mutations GraphQL
│   ├── query.ts         # Exportación de queries
│   └── mutation.ts      # Exportación de mutations
└── graphql.config.yml   # Configuración de GraphQL
```

## 🔌 GraphQL

El proyecto está configurado con Apollo Client para trabajar con GraphQL.

### Uso de Queries

```typescript
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '@/services/query';

function ProfileComponent({ rut }: { rut: string }) {
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { rut },
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.Member?.getByRut?.names}</div>;
}
```

### Uso de Mutations

```typescript
import { useMutation } from '@apollo/client';
import { CREATE_MEMBER } from '@/services/mutation';

function CreateMemberComponent() {
  const [createMember, { loading, error }] = useMutation(CREATE_MEMBER);

  const handleSubmit = async (memberData: any) => {
    try {
      const result = await createMember({
        variables: { member: memberData },
      });
      console.log('Miembro creado:', result.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button onClick={() => handleSubmit({...})} disabled={loading}>
      Crear Miembro
    </button>
  );
}
```

### Agregar nuevas Queries/Mutations

1. Crea el archivo `.graphql` en `services/graphql/query/` o `services/graphql/mutation/`
2. Crea el archivo `.ts` correspondiente con el mismo nombre
3. Exporta la query/mutation en `services/query.ts` o `services/mutation.ts`

Ejemplo:
- `services/graphql/query/GetAllUsers.graphql`
- `services/graphql/query/GetAllUsers.ts`
- Agregar exportación en `services/query.ts`

## 🎨 Componentes UI

El proyecto usa shadcn/ui. Para agregar nuevos componentes:

```bash
npx shadcn@latest add [component-name]
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🔐 Autenticación

El proyecto maneja la autenticación mediante tokens JWT almacenados en `localStorage`. El token se valida automáticamente antes de cada solicitud GraphQL y se limpia si está expirado.

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
