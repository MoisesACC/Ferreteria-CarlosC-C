# 🛠️ Sistema de Gestión de Ferretería Profesional - Carlos C&C v2.5

¡Bienvenido a **Carlos C&C**, una plataforma e-commerce de alto rendimiento diseñada específicamente para el sector de suministros industriales y ferretería! Este proyecto combina un diseño de vanguardia con una arquitectura robusta y moderna.

---

## 🚀 Novedades de la Versión 2.5

En las últimas actualizaciones, hemos elevado el proyecto a un nivel profesional con las siguientes implementaciones clave:

- **🔐 Google Authentication (OAuth 2.0)**: Inicio de sesión y registro instantáneo con Google, permitiendo un flujo de compra sin fricciones.
- **📄 Facturación Electrónica Digital**: Generación automática de **Boletas y Facturas en PDF** con diseño profesional.
- **🔍 Validación QR**: Cada comprobante incluye un código QR único para validación rápida.
- **📱 Optimización Mobile-First**: Rediseño completo de las secciones de **Checkout**, **Mis Pedidos** y **Panel Administrativo** para una experiencia perfecta en smartphones y tablets.

---

## 🌟 Características Principales

### 🖥️ Frontend (Experiencia de Usuario)
- **Diseño Premium & Adaptativo**: Interfaz moderna con efectos de *Glassmorphism*, optimizada para todas las pantallas.
- **Acceso Inteligente**: Soporte para Login tradicional y **Google Login** integrado.
- **Gestión de Pedidos**: Visualización detallada de compras pasadas con acceso directo a comprobantes digitales.
- **Modo Oscuro/Claro Dinámico**: Sistema de temas que garantiza la legibilidad en cualquier entorno.
- **Home Dinámica**: Countdown para ofertas, sliders de alto impacto y carrusel de marcas líderes.

### ⚙️ Backend (Arquitectura y Datos)
- **API REST Segura**: Endpoints optimizados para la gestión de productos, usuarios y pedidos.
- **Motor de Comprobantes**: Lógica para la emisión selectiva de Boletas o Facturas según el tipo de cliente.
- **Integración con Google API**: Verificación de tokens de identidad en el servidor para máxima seguridad.
- **Data Seeding**: Población automática de la base de datos con productos reales para pruebas inmediatas.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Autenticación**: [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Estilos**: Vanilla CSS con sistema de variables dinámicas y Mobile-First Media Queries.

### Backend
- **Lenguaje**: Java 17+
- **Framework**: [Spring Boot 3.x](https://spring.io/projects/spring-boot)
- **Generación PDF**: [iText7](https://itextpdf.com/)
- **Generación QR**: [ZXing](https://github.com/zxing/zxing)
- **Seguridad**: Spring Security + Google Auth Verifier.

---

## 📦 Instalación y Configuración

### 1. Variables de Entorno (.env)
Para habilitar Google Login, crea un archivo `.env` en la carpeta `ProyectoFerreteria`:
```env
VITE_GOOGLE_CLIENT_ID=tu_id_de_cliente_de_google
```

### 2. Levantar el Backend
Requiere **JDK 17+**.
```bash
cd ferreteria-api
mvn spring-boot:run
```

### 3. Levantar el Frontend
Requiere **Node.js**.
```bash
cd ProyectoFerreteria
npm install
npm run dev
```

---

## 👤 Acceso a la Administración

- **🔐 Usuario**: `admin@ferreteria.com`
- **🔑 Contraseña**: `admin123`

---

## 🗺️ Roadmap Actualizado

### Completado ✅
- [x] **Generación de Facturas PDF:** Implementado con iText7.
- [x] **Google Auth:** Integración perfecta en Frontend y Backend.
- [x] **Diseño Responsivo:** Checkout y Admin Panel 100% adaptativos.
- [x] **Validación QR:** Integrado en comprobantes digitales.

### Próximos Pasos 🚀
- [ ] **Tablero Estadístico:** Gráficas de ventas mensuales en el Admin Panel.
- [ ] **Notificaciones Email:** Envío automático del PDF al correo del cliente tras la compra.
- [ ] **Gestión de Stock Crítico:** Alertas visuales para productos con bajo inventario.

---

## 🖋️ Autor
Proyecto desarrollado con enfoque en diseño e ingeniería de software moderna para **Carlos C&C**.
*Carlos C&C - Herramientas que construyen tus sueños.*
