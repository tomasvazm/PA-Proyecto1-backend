# Distribuidora BV - Sistema de Gestión

Backend para el sistema de gestión integral de una distribuidora. Construido con NestJS, TypeScript y MySQL, siguiendo una arquitectura modular con patrones de diseño orientados al dominio.

---

## Stack tecnológico

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.7
- **Base de datos**: MySQL 8.0 + TypeORM 0.3.22
- **Autenticación**: JWT + bcrypt
- **Documentación API**: Swagger / OpenAPI
- **Procesamiento de archivos**: Multer, Sharp, Tesseract.js (OCR), XLSX
- **Generación de PDFs**: PDFKit, PDFMake
- **Email**: Nodemailer
- **Testing**: Jest + ts-jest
- **Linting/Formato**: ESLint + Prettier
- **Infraestructura**: Docker + Docker Compose
- **Analytics**: Metabase

---

## Estructura del proyecto

```
distribuidora-bv/
├── src/
│   ├── main.ts                        # Bootstrap de la aplicación
│   ├── app.module.ts                  # Módulo raíz
│   ├── index.ts                       # Exportación central de entidades
│   ├── migrations/                    # Migraciones de base de datos
│   └── modules/
│       ├── gestion-usuario/           # Usuarios, autenticación, roles
│       ├── gestion-productos/         # Catálogo, stock, precios
│       ├── gestion-documentos/        # Facturas, pedidos, remitos, notas
│       ├── gestion-cobros-pagos/      # Cobros, pagos, cajas, cheques, tarjetas
│       ├── gestion-cuenta/            # Cuentas corrientes de clientes
│       ├── gestion-bancos/            # Bancos, movimientos, documentos bancarios
│       ├── gestion-sistema/           # Configuración, notificaciones, auditoría
│       ├── gestion-despacho/          # Despacho y logística
│       ├── organizacion/              # Clientes, proveedores, personal, zonas
│       ├── afip/                      # Integración AFIP (WSAA, WSFE)
│       ├── impresion/                 # Generación de reportes e impresión
│       ├── gutil/                     # Utilidades: provincias, localidades, IVA
│       └── common/                    # Filtros, pipes, decoradores, seeds
├── test/                              # Tests E2E
├── uploads/                           # Archivos subidos
├── tessdata/                          # Datos de entrenamiento OCR
├── assets/                            # Recursos estáticos
├── fuentes/                           # Fuentes tipográficas
├── orm.config.ts                      # Configuración DataSource TypeORM
├── docker-compose.yml                 # Servicios Docker
├── Dockerfile                         # Build multi-stage
├── .env                               # Variables de entorno
└── tsconfig.json                      # Configuración TypeScript
```

### Estructura interna de cada módulo

Cada módulo sigue la misma convención:

```
modulo/
├── domain/
│   └── entities/        # Entidades TypeORM
├── application/         # Servicios y casos de uso
├── infraestructure/     # Repositorios y acceso a datos
├── dto/                 # Data Transfer Objects
└── *.module.ts          # Definición del módulo NestJS
```

---

## Módulos principales

| Módulo | Descripción |
|---|---|
| `gestion-usuario` | Usuarios, autenticación JWT, roles y permisos |
| `gestion-productos` | Marcas, líneas, productos, stock, historial de precios |
| `gestion-documentos` | Facturas de venta/compra, pedidos, remitos, notas de crédito/débito |
| `gestion-cobros-pagos` | Cajas, cobros, pagos, cheques, tarjetas de crédito |
| `gestion-cuenta` | Cuentas corrientes, detalles, saldos impagos |
| `gestion-bancos` | Bancos, familias de banco, movimientos bancarios |
| `gestion-sistema` | Configuración del sistema, auditoría, notificaciones |
| `gestion-despacho` | Gestión de despacho y entregas |
| `organizacion` | Clientes, proveedores, personal, puntos de venta, zonas |
| `afip` | Integración con AFIP: WSAA, WSFE, parámetros fiscales |
| `impresion` | Generación de PDFs y reportes imprimibles |
| `gutil` | Provincias, localidades, condiciones de IVA, domicilios |
| `common` | Seeds, filtros globales, pipes, decoradores, excepciones |

---

## Configuración

### Variables de entorno (`.env`)

Copiar la plantilla y completar los valores locales:

```bash
cp .env.example .env
```

Para ejecutar NestJS directamente en el equipo, la configuración local utiliza:

```env
DB_HOST=localhost
DB_PORT=3310
DB_USERNAME=admin
DB_PASSWORD=replace_me
DB_DATABASE=proyecto
DB_TYPE=mysql
DB_SSL=false
DB_SSL_CA=

PORT=3000
JWT_SECRET=replace_me
JWT_EXPIRATION_ACCESS=60s
JWT_EXPIRATION_REFRESH=7d
PUNTO_VENTA_ACTIVO_ID=2

MYSQL_ROOT_PASSWORD=replace_me
MYSQL_DATABASE=proyecto
MYSQL_USER=admin
MYSQL_PASSWORD=replace_me

SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=replace_me
SEED_PERSONAL_NEGOCIO_PASSWORD=replace_me
SEED_PERSONAL_REPOSITOR_PASSWORD=replace_me
SEED_PERSONAL_ADMINISTRADOR_PASSWORD=replace_me
SEED_PERSONAL_TOMAS_PASSWORD=replace_me
SEED_PERSONAL_REPARTIDOR_PASSWORD=replace_me
SEED_PERSONAL_COBRADOR_PASSWORD=replace_me
DEFAULT_USER_PASSWORD=replace_me
```

El archivo `.env` contiene valores locales y no debe subirse al repositorio. La plantilla pública es `.env.example`.

Para conectarse a Aiven u otro proveedor que requiera TLS, configura las variables de base de datos con los valores entregados por el proveedor:

```env
DB_HOST=host-del-proveedor
DB_PORT=18843
DB_USERNAME=usuario
DB_PASSWORD=secreto
DB_DATABASE=defaultdb
DB_SSL=true
DB_SSL_CA=certificado-CA
```

`DB_SSL_CA` es opcional cuando `DB_SSL=true`. Si el proveedor entrega un certificado CA, se recomienda configurarlo para validar explícitamente el servidor. El certificado puede almacenarse como secreto de entorno con saltos de línea reales o representados como `\n`. Nunca debe agregarse al repositorio.

---

## Instalación y ejecución

### Con Docker Compose (base de datos local)

El proyecto utiliza Docker Compose para ejecutar MySQL 8 localmente:

```bash
docker compose up -d mysql
```

La aplicación NestJS se ejecuta con Yarn fuera de Docker. MySQL queda disponible en `localhost:3310`.

Para iniciar también phpMyAdmin:

```bash
docker compose up -d
```

Los datos de MySQL se guardan en el volumen Docker `proyecto_mysql_data`. No uses `docker compose down -v` si necesitas conservar la base local.

### Local

```bash
# Instalar dependencias sin modificar yarn.lock
yarn install --frozen-lockfile

# Crear el esquema de la base de datos
yarn migration:run

# Desarrollo con hot-reload
yarn start:dev

# Compilar y ejecutar como producción
yarn build
yarn start:prod
```

---

## Scripts disponibles

```bash
yarn start              # Iniciar en modo normal
yarn start:dev          # Iniciar con watch mode
yarn build              # Compilar TypeScript
yarn lint               # Corregir errores de linting
yarn test               # Ejecutar tests unitarios
yarn test:e2e           # Ejecutar tests E2E
yarn test:cov           # Cobertura de tests
yarn migration:generate # Generar una migración
yarn migration:run      # Ejecutar migraciones pendientes
yarn migration:revert   # Revertir la última migración
```

Las migraciones crean o modifican la estructura de la base de datos y quedan registradas en la tabla `migrations`. `synchronize` permanece desactivado para evitar cambios automáticos y no controlados en el esquema.

### Presentación de productos

Las altas de productos requieren una presentación estructurada:

```json
{
  "presentacion": {
    "cantidad": 1,
    "unidad": "L"
  }
}
```

Las unidades permitidas son `ML`, `L`, `G`, `KG` y `UNIDADES`. La cantidad debe ser positiva, no superar `999999999.999` y admite hasta tres decimales. Los productos existentes conservan una presentación nula hasta que se actualicen; los campos heredados `utilizaPack` y `cantidadPorPack` se mantienen por compatibilidad.

Antes de desplegar una versión que incluya este cambio, ejecutar `yarn migration:run` contra la base de datos destino para agregar las columnas de presentación.

## Seeds

Los seeds insertan datos iniciales, como roles, el usuario administrador, provincias y datos de productos. No se ejecutan automáticamente al iniciar la aplicación.

Con la aplicación levantada, los endpoints disponibles actualmente son:

```text
GET /api/seed-all/execute
GET /api/seed-usuario/execute
GET /api/seed-organizacion/execute
GET /api/seed-familia-producto/execute
```

El seed general depende de que exista primero el usuario administrador y utiliza algunos identificadores fijos. El administrador se configura mediante `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`.

Estos endpoints requieren un token JWT válido y un rol `Administrador` o `Root`. Una solicitud anónima recibe `401 Unauthorized`.

Aunque están protegidos, se recomienda ejecutarlos únicamente cuando sea necesario y no exponerlos como parte del flujo normal de producción. Antes de ejecutar seeds en Render deben configurarse sus variables de entorno y verificarse los datos iniciales.

### Crear el administrador inicial en una base vacía

Cuando una base remota ya tiene las migraciones aplicadas pero todavía no tiene usuarios, los endpoints de seeds no pueden utilizarse porque requieren autenticación. Para resolver el primer arranque existe un comando local controlado:

```bash
SEED_ADMIN_EMAIL=admin@example.com \
SEED_ADMIN_PASSWORD='contraseña-secreta' \
yarn bootstrap:admin
```

El comando crea el rol `Administrador` y el usuario indicado si no existen. Debe ejecutarse con las variables de conexión de la base destino cargadas en la misma terminal, como se describe para las migraciones. No publica un endpoint adicional y no ejecuta los demás seeds.

Para no dejar la contraseña en el historial de la terminal, se recomienda cargarla de forma interactiva:

```bash
read -r -s -p "Contraseña del administrador: " SEED_ADMIN_PASSWORD
printf '\n'
export BOOTSTRAP_ADMIN_CONFIRM='remote'
export SEED_ADMIN_PASSWORD
export SEED_ADMIN_EMAIL='admin@example.com'
yarn bootstrap:admin
unset BOOTSTRAP_ADMIN_CONFIRM SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD
```

`BOOTSTRAP_ADMIN_CONFIRM=remote` es obligatorio para evitar ejecutar accidentalmente el comando contra la base local cargada desde `.env`.

Después de crear el administrador, se puede iniciar sesión en `/api/auth/login` y ejecutar los seeds restantes desde sus endpoints protegidos, si se necesitan.

## Deuda técnica conocida

Fuera del alcance de la validación de despliegue quedan:

- usuarios de personal con credenciales iniciales escritas en los seeds;
- endpoints de seed `GET` sin protección específica;
- dependencias de los seeds respecto de identificadores fijos;
- manejo de errores y transacciones de los seeds;
- inconsistencias funcionales y tests de los módulos.

Estos puntos no impiden el despliegue local validado, pero deben revisarse antes de un entorno público.

---

## Documentación API

Una vez levantada la aplicación, la documentación Swagger está disponible en:

```
http://localhost:3000/api
```

Todos los endpoints tienen el prefijo `/api`.

---

## Convenciones de código

- **Módulos y archivos**: kebab-case (`gestion-usuario`, `factura-venta.service.ts`)
- **Clases y entidades**: PascalCase (`FacturaVenta`, `Usuario`)
- **Tablas en BD**: snake_case (`factura_venta`, `tipo_movimiento_bancario`)
- **DTOs**: validados con `class-validator`, con whitelist estricto
- **Excepciones**: manejadas por filtro global (`GlobalExceptionFilter`)
- **Body limit**: 50MB para JSON y URL-encoded
