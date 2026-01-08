# 🛠️ Sistema de Gestión de Ferretería Profesional - Carlos C&C v2.0

¡Bienvenido a **Carlos C&C**, una plataforma e-commerce de alto rendimiento diseñada específicamente para el sector de suministros industriales y ferretería! Este proyecto nace de la necesidad de ofrecer una experiencia de usuario moderna, rápida y profesional, combinando un diseño de vanguardia con una arquitectura robusta.

---

## 🚀 Visión General

El proyecto consiste en una plataforma integral que permite la gestión completa de una ferretería, desde la vitrina digital orientada al cliente hasta el panel administrativo de control. Se divide en dos piezas clave:

1.  **Frontend**: Una Single Page Application (SPA) construida con React que prioriza la estética y la fluidez.
2.  **Backend**: Una API REST robusta desarrollada en Java con Spring Boot para el manejo eficiente de datos y lógica de negocio.

---

## 🌟 Características Principales

### 🖥️ Frontend (Experiencia de Usuario)
- **Diseño Premium & Adaptativo**: Interfaz moderna inspirada en líderes industriales, optimizada para todas las pantallas.
- **Modo Oscuro/Claro Dinámico**: Cambio de tema instantáneo que ajusta incluso la visibilidad de logotipos y elementos críticos.
- **Home Dinámica**:
    - **Countdown Timer**: Cronómetro persistente para ofertas relámpago del mes.
    - **Promociones Marquee**: Barra de anuncios animada para envíos y contactos.
    - **Sliders de Alto Impacto**: Hero sliders con transiciones fluidas.
- **Gestión de Marcas**: Catálogo visual de marcas líderes (Makute, Hermex, Uyustools, etc.) con fondos inteligentes.
- **Sección de Testimonios**: Carrusel de opiniones de clientes con valoraciones reales.
- **Carrito de Compras en Tiempo Real**: Experiencia de compra sin fricciones.

### ⚙️ Backend (Arquitectura y Datos)
- **RESTful API**: Endpoints limpios y documentados para productos, categorías, pedidos y testimonios.
- **Inicialización Automática (Data Seeding)**: El sistema detecta si la base de datos está vacía y la llena con productos y categorías reales para demostración inmediata.
- **Modelado de Datos Completo**: Gestión de relaciones complejas (Pedidos -> Detalles -> Productos).
- **Persistencia Robusta**: Integración con PostgreSQL/MySQL mediante JPA y Hibernate.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Comunicación**: [Axios](https://axios-http.com/)
- **Estilos**: Vanilla CSS con un sistema robusto de variables dinámicas.

### Backend
- **Lenguaje**: Java 17+
- **Framework**: [Spring Boot 3.x](https://spring.io/projects/spring-boot)
- **Base de Datos**: JPA / Hibernate con H2 (Desarrollo) / MySQL (Producción).
- **Utilidades**: Lombok, Spring Data JPA.

---

## 📦 Instalación y Configuración

Sigue estos pasos para poner el proyecto en marcha en tu entorno local.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/proyecto-ferreteria.git
cd proyecto-ferreteria
```

### 2. Levantar el Backend
Requiere **Maven** y **JDK 17+**.
```bash
cd ferreteria-api
mvn clean install
mvn spring-boot:run
```
> El servidor se iniciará en `http://localhost:8080`.

### 3. Levantar el Frontend
Requiere **Node.js**.
```bash
cd ProyectoFerreteria
npm install
npm run dev
```
> La aplicación estará disponible en `http://localhost:5173`.

---

## 👤 Acceso a la Administración

Para probar las funcionalidades de gestión, utiliza las siguientes credenciales de prueba:

- **🔐 Usuario**: `admin@ferreteria.com`
- **🔑 Contraseña**: `admin123`

---

## 🗺️ Roadmap / Próximas Mejoras

Para escalar este proyecto a un entorno de producción masivo, se han identificado las siguientes áreas claves de desarrollo:

### 1. Arquitectura y Rendimiento
- [ ] **Implementar TanStack Query (React Query):** Para una gestión profesional del estado asíncrono, caché inteligente y reintentos automáticos.
- [ ] **Optimización de Assets:** Introducir soporte para imágenes **WebP** y técnica de **Lazy Loading** avanzada.
- [ ] **Code Splitting:** Carga dinámica de rutas para reducir el bundle inicial.

### 2. Experiencia de Usuario (UX)
- [ ] **Filtros Avanzados:** Búsqueda por rango de precio, marca y disponibilidad en tiempo real.
- [ ] **Wishlist (Lista de Deseos):** Permitir a los usuarios guardar herramientas favoritas.
- [ ] **Sistema de Reseñas:** Implementar valoraciones mediante estrellas y comentarios de clientes.
- [ ] **Búsqueda Inteligente:** Autocompletado y sugerencias visuales en el buscador.

### 3. Integraciones de Negocio
- [ ] **Pasarela de Pago Real:** Conectar el flujo de checkout con **Stripe API** o **Mercado Pago**.
- [ ] **Gestión de Stock Crítico:** Alertas automáticas al administrador cuando un producto tenga bajo inventario.
- [ ] **Generación de Facturas PDF:** Creación automática de comprobantes de pago descargables.

### 4. Seguridad, SEO y Marketing
- [ ] **Validación con Zod:** Implementar `React Hook Form` junto a `Zod` para validaciones de esquema estrictas.
- [ ] **SEO Dinámico:** Uso de `React Helmet` para optimizar cada producto individual en Google.
- [ ] **Dashboard Estadístico:** Integrar gráficas interactivas (`Recharts`) para visualizar tendencias de ventas.

---

## 🖋️ Autor
Proyecto desarrollado con enfoque en diseño e ingeniería de software moderna para **Carlos C&C**. Espero que este repositorio te sirva de ayuda para tus propios desarrollos. ¡Cualquier feedback es bienvenido!

---
*Carlos C&C - Herramientas que construyen tus sueños.*
