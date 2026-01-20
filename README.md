# 🛠️ Sistema de Gestión de Ferretería Profesional - Carlos C&C v3.0

¡Bienvenido a **Carlos C&C**, una plataforma e-commerce de alto rendimiento diseñada específicamente para el sector de suministros industriales y ferretería! Este proyecto combina un diseño de vanguardia con una arquitectura robusta y moderna, ahora completamente desplegada y optimizada para la nube.

---

## 🚀 Novedades de la Versión 3.0 (Despliegue & Optimización)

Esta versión marca un hito importante con el despliegue a producción y mejoras significativas en la experiencia de usuario móvil:

- **☁️ Despliegue en la Nube**:
  - **Backend**: Spring Boot desplegado en **Render**.
  - **Frontend**: React (Vite) desplegado en **Vercel** con soporte SPA.
  - **Base de Datos**: MySQL gestionado en **Aiven** con optimizaciones para entidades complejas.
- **📄 Visualización Segura de Comprobantes**: Nueva funcionalidad para ver Boletas y Facturas PDF directamente en la aplicación (sin descargas forzadas) tanto en el perfil del cliente como en el panel administrativo, utilizando autenticación segura por tokens.
- **📱 Experiencia Móvil Rediseñada**:
  - **Grid Inteligente**: Catálogo de productos optimizado a 2 columnas fijas en móviles para mejor visibilidad.
  - **Galería Táctil**: Nuevo carrusel de imágenes con *snap scrolling* y diseño horizontal robusto.
  - **Información Condensada**: Botón "Ver más" para descripciones largas y cintas de confianza (Envío, Garantía) adaptadas a pantallas verticales.
- **🖼️ Gestión de Imágenes Avanzada**: Reestructuración de la base de datos para manejar múltiples imágenes de productos de manera eficiente.

---

## 🌟 Características Principales

### 🖥️ Frontend (Experiencia de Usuario)
- **Diseño Premium & Adaptativo**: Interfaz moderna con efectos de *Glassmorphism*, sombras suaves y tipografía responsiva.
- **Catálogo Interactivo**: Filtros por precio, categoría y marca, con ordenamiento dinámico.
- **Detalle de Producto Inmersivo**: Nueva disposición con galería destacada, iconos de confianza y acciones de compra flotantes.
- **Acceso Inteligente**: Soporte para Login tradicional y **Google Login** integrado de forma segura.
- **Gestión de Pedidos & Facturación**: Historial completo con acceso instantáneo a PDFs validados con QR.

### ⚙️ Backend (Arquitectura y Datos)
- **API REST Segura**: Endpoints protegidos con JWT y roles (ADMIN/USER).
- **Integración Cloud**: Configuración preparada para entornos de producción (variables de entorno para secretos).
- **Motor de PDF**: Generación dinámica de documentos tributarios con códigos QR vinculados al dominio público.
- **Compatibilidad MySQL Cloud**: Ajustes JPA/Hibernate específicos para bases de datos en la nube (Aiven).

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Despliegue**: [Vercel](https://vercel.com/)
- **Autenticación**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Estilos**: Vanilla CSS modular con variables CSS y Media Queries avanzadas.

### Backend
- **Lenguaje**: Java 17+
- **Framework**: [Spring Boot 3.x](https://spring.io/projects/spring-boot)
- **Despliegue**: [Render](https://render.com/)
- **Base de Datos**: MySQL (Aiven)
- **Generación PDF**: [iText7](https://itextpdf.com/)
- **Seguridad**: Spring Security + JWT + Google Auth.

---

## 📦 Instalación y Configuración (Local)

### 1. Variables de Entorno (.env)
Para conectar el Frontend local con el Backend (local o producción), configura el archivo `.env`:
```env
# URL del Backend (puede ser localhost:8080 o la URL de Render)
VITE_API_URL=https://ferreteria-backend-api.onrender.com/api

# Client ID de Google Cloud Console
VITE_GOOGLE_CLIENT_ID=tu_cliente_id_google
```

### 2. Configuración Backend (application.yml)
Asegúrate de configurar tus credenciales de base de datos y JWT en las variables de entorno del sistema o en el archivo de configuración:
```yaml
spring:
  datasource:
    url: ${DB_URL} # jdbc:mysql://...
    username: ${DB_USER}
    password: ${DB_PASSWORD}
```

### 3. Ejecución
**Backend:**
```bash
cd ferreteria-api
mvn spring-boot:run
```

**Frontend:**
```bash
cd ProyectoFerreteria
npm install
npm run dev
```

---

## 👤 Acceso a la Administración

- **🔐 Usuario**: `admin@ferreterias.com`
- **🔑 Contraseña**: `admin123`

---

## 🗺️ Roadmap Actualizado

### Completado ✅
- [x] **Despliegue Fullstack:** Render (Back) + Vercel (Front) + Aiven (DB).
- [x] **Visualización PDF In-App:** Solución segura con `Blob` y `ObjectURL`.
- [x] **Mobile UX/UI:** Grid de 2 columnas, galería touch, layout optimizado.
- [x] **Fix Base de Datos:** Entidad `ProductoImagen` para compatibilidad SQL estricta.

### Próximos Pasos 🚀
1.  **💳 Pasarela de Pagos**: Integrar Stripe o MercadoPago para procesar cobros reales.
2.  **📊 Dashboard Analítico**: Gráficos de ingresos, productos más vendidos y usuarios nuevos.
3.  **📧 Notificaciones Email**: Envío de correos transaccionales (confirmación de compra, recuperación de clave).
4.  **❤️ Lista de Deseos (Wishlist)**: Permitir a usuarios guardar productos para después (persistencia en DB).
5.  **📦 Gestión de Inventario**: Control de stock en tiempo real con alertas de bajo inventario.

---

## 🖋️ Autor
Proyecto desarrollado con enfoque en diseño e ingeniería de software moderna para **Carlos C&C**.
*Carlos C&C - Herramientas que construyen tus sueños.*
