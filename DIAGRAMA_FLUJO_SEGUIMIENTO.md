# 🎯 Seguimiento de Pedidos - Diagrama de Flujo

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    SELLOS-G PLATFORM                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   CLIENTE    │  │   EMPLEADO   │  │    ADMIN     │
└──────────────┘  └──────────────┘  └──────────────┘
      │                 │                   │
      │                 │                   │
      ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────┐
│              AUTHENTICATED ROUTES                    │
│          (JWT Token Required)                        │
└─────────────────────────────────────────────────────┘
```

---

## Flujo de Pedidos - Vista del Cliente

```
CLIENTE DASHBOARD
    │
    ├─ Panel Principal
    ├─ Catálogo (Navegar productos)
    ├─ Realizar Pedido (Crear solicitud)
    │
    └─► SEGUIMIENTO DE PEDIDOS ◄─── ESTA ES LA NUEVA SECCIÓN
        │
        ├─ GET /pedidos/mis-pedidos
        │
        ├─ Mis pedidos
        │   │
        │   ├─ Pedido #ABC123
        │   │   ├─ Estado: En Proceso ⏳
        │   │   ├─ Asignado a: Carlos Rodríguez
        │   │   ├─ Productos:
        │   │   │   ├─ Sello Premium x5 ($750)
        │   │   │   └─ Tinta Especial x2 ($80)
        │   │   ├─ Total: $830
        │   │   └─ Nota: "Estamos procesando tu pedido"
        │   │
        │   └─ Pedido #XYZ789
        │       ├─ Estado: Completado ✅
        │       ├─ Asignado a: María García
        │       ├─ Productos: [...]
        │       └─ Total: $1,500
```

---

## Interacciones por Rol

### 🟢 CLIENTE (Lectura)
```
┌─────────────────────────────────────┐
│  CLIENTE                            │
└─────────────────────────────────────┘
         │
         ├─ VE: Sus pedidos ✅
         ├─ VE: Empleado asignado ✅
         ├─ VE: Estado del pedido ✅
         ├─ VE: Productos y totales ✅
         ├─ VE: Notas del admin ✅
         │
         ├─ NO PUEDE: Editar ❌
         ├─ NO PUEDE: Cambiar estado ❌
         ├─ NO PUEDE: Eliminar ❌
         └─ NO PUEDE: Hacer acciones ❌
```

### 🔵 EMPLEADO (Lectura + Escribir)
```
┌─────────────────────────────────────┐
│  EMPLEADO                           │
└─────────────────────────────────────┘
         │
         ├─ VE: Pedidos asignados ✅
         ├─ VE: Datos del cliente ✅
         ├─ VE: Productos a entregar ✅
         │
         └─ PUEDE: Cambiar estado ✅
             ├─ Pendiente → En Proceso
             ├─ En Proceso → Completado
             └─ Cualquiera → Cancelado
```

### 🔴 ADMIN (Control Total)
```
┌─────────────────────────────────────┐
│  ADMINISTRADOR                      │
└─────────────────────────────────────┘
         │
         ├─ VE: Todos los pedidos ✅
         ├─ CREA: Nuevos pedidos ✅
         ├─ ASIGNA: Empleados ✅
         ├─ SELECCIONA: Productos ✅
         ├─ EDITA: Pedidos ✅
         ├─ AGREGA: Notas ✅
         └─ ELIMINA: Pedidos ✅
```

---

## Flujo de Sincronización en Tiempo Real

```
ADMIN: Crea Pedido para Cliente X
         │
         ▼
    ┌─────────────────────────┐
    │ POST /pedidos           │
    │ (Admin autorizado)      │
    └─────────────────────────┘
         │
         ▼
    ┌─────────────────────────┐
    │ Almacena en BD          │
    │ Cliente ID: X           │
    │ Empleado: Y             │
    │ Productos: [...]        │
    └─────────────────────────┘
         │
         ▼
CLIENTE X accede a:
GET /pedidos/mis-pedidos
         │
         ▼
    ┌─────────────────────────┐
    │ Encuentra petido        │
    │ cliente: X (✓ Match)    │
    └─────────────────────────┘
         │
         ▼
Cliente ve su pedido en
SEGUIMIENTO DE PEDIDOS
```

---

## Estados del Pedido - Timeline Visual

```
PENDIENTE          EN PROCESO          COMPLETADO
   🟡                  🔵                  🟢
   │                   │                   │
   ├─────────────────┤├─────────────────┤
                              
Cliente ve:
• Punto amarillo: Mi pedido está registrado
• Punto azul: Se está procesando
• Punto verde: ¡Listo para recoger!
```

---

## Estructura de Datos - Pedido

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  cliente: {
    _id: ObjectId("..."),
    nombre: "Juan Pérez",
    correo: "juan@example.com",
    telefono: "+34 555-1234"
  },
  
  empleadoAsignado: {
    _id: ObjectId("..."),
    nombre: "Carlos",
    apellido: "Rodríguez",
    correo: "carlos@empresa.com"
  },
  
  productos: [
    {
      producto: {
        _id: ObjectId("..."),
        nombre: "Sello Premium",
        imagenUrl: "data:image/png;base64:...",
        precioActual: 150
      },
      cantidad: 5,
      precioUnitario: 150,
      subtotal: 750
    },
    {
      producto: {
        _id: ObjectId("..."),
        nombre: "Tinta Especial",
        imagenUrl: "...",
        precioActual: 40
      },
      cantidad: 2,
      precioUnitario: 40,
      subtotal: 80
    }
  ],
  
  total: 830,
  
  estado: "en proceso",  // pendiente, en proceso, completado, cancelado
  
  notaEmpleado: "Estamos procesando tu pedido. Se enviará en 2 días hábiles.",
  
  createdAt: "2025-12-10T14:30:00Z",
  updatedAt: "2025-12-10T14:35:00Z"
}
```

---

## Rutas API

```
CLIENTE
  GET /api/pedidos/mis-pedidos
    └─ Obtiene SOLO pedidos del cliente autenticado
    └─ Retorna: Array de Pedidos
    └─ Headers: { Authorization: Bearer {token} }

EMPLEADO
  GET /api/pedidos/asignados
    └─ Obtiene pedidos asignados al empleado
    
  PATCH /api/pedidos/:id/estado
    └─ Actualiza solo el campo "estado"
    └─ Body: { estado: "en proceso" | "completado" }

ADMIN
  GET /api/pedidos
    └─ Obtiene TODOS los pedidos
    
  POST /api/pedidos
    └─ Crea nuevo pedido
    
  PUT /api/pedidos/:id
    └─ Edita pedido completo
    
  DELETE /api/pedidos/:id
    └─ Elimina pedido
```

---

## Componentes Frontend

```
src/pages/
├── admin/
│   └── sections/
│       └── Orders.jsx          (Gestión completa)
│
├── empleado/
│   ├── Dashboard.jsx
│   └── sections/
│       └── AssignedOrders.jsx  (Mis asignaciones)
│
└── cliente/
    ├── Dashboard.jsx
    └── sections/
        └── OrderTracking.jsx   (NUEVO - Seguimiento)
```

---

## Componente OrderTracking - Estructura

```jsx
<OrderTracking>
  ├─ Encabezado
  │  └─ "Seguimiento de Pedidos"
  │
  ├─ Lista de Pedidos
  │  └─ Tarjeta de Pedido (para cada pedido)
  │     ├─ Número y Fecha
  │     ├─ Estado con Icono
  │     ├─ Empleado Asignado ◄─── NUEVA SECCIÓN
  │     ├─ Productos
  │     │  ├─ Imagen
  │     │  ├─ Nombre
  │     │  ├─ Cantidad
  │     │  └─ Precio
  │     ├─ Nota del Admin (si existe)
  │     ├─ Total Destacado
  │     └─ Timeline Visual
  │
  └─ Estados
     ├─ Cargando
     └─ Sin pedidos
```

---

## Flujo Completo: Cliente Viendo su Seguimiento

```
1. CLIENTE ACCEDE
   Cliente abre app → Inicia sesión → Aceptado ✅

2. NAVEGA A SEGUIMIENTO
   Dashboard → Click "Seguimiento" → /cliente/dashboard/seguimiento

3. CARGA DATOS
   Frontend ejecuta:
   GET /api/pedidos/mis-pedidos
   Headers: { Authorization: "Bearer eyJhbGc..." }

4. SERVIDOR VALIDA
   ├─ Verifica token ✅
   ├─ Extrae clienteId del token
   ├─ Busca: Pedido.find({ cliente: clienteId })
   ├─ Popula datos relacionados
   └─ Retorna array de pedidos

5. FRONTEND RENDERIZA
   ├─ Para cada pedido:
   │  ├─ Muestra número y fecha
   │  ├─ Muestra estado (pendiente/en proceso/completado)
   │  ├─ Muestra EMPLEADO ASIGNADO ◄─── CLAVE
   │  ├─ Lista productos con imágenes
   │  ├─ Muestra total
   │  └─ Muestra nota si existe
   │
   └─ Resultado: UI hermosa y clara

6. CLIENTE VE
   ✅ Sus pedidos
   ✅ Quién está procesándolo
   ✅ Qué pidió exactamente
   ✅ El total
   ✅ Mensajes importantes
   ✅ Dónde va su pedido (timeline)
```

---

## Seguridad

```
AUTENTICACIÓN
  └─ JWT Token en Authorization Header
     
AUTORIZACIÓN
  ├─ Cliente solo ve: sus propios pedidos
  ├─ Empleado solo ve: sus asignaciones
  └─ Admin ve: todo

BASE DE DATOS
  └─ Campo cliente en Pedido vinculado a Cliente ID
     └─ Garantiza que cliente solo acceda a sus datos
```

---

## Próximos Pasos Opcionales

```
✅ Implementado: Seguimiento básico de pedidos

🔄 Mejoras futuras:
  ├─ Notificaciones en tiempo real (Socket.io)
  ├─ Historial de cambios de estado
  ├─ Estimado de entrega
  ├─ Opción para reordenar productos favoritos
  ├─ Calificación del pedido
  ├─ Descarga de factura/recibo
  └─ Chat con empleado asignado
```

---

## Resumen Ejecutivo

| Aspecto | Detalles |
|---------|----------|
| **Funcionalidad** | Clientes ven seguimiento de sus pedidos |
| **Empleado Visible** | ✅ Sí, con nombre y contacto |
| **Acciones Cliente** | ❌ Solo lectura, sin ediciones |
| **Datos Mostrados** | Estado, Empleado, Productos, Total, Notas |
| **Seguridad** | JWT + Filtro por Cliente ID |
| **Base de Datos** | Modelo Pedido existente |
| **Frontend** | OrderTracking.jsx actualizado |
| **Backend** | Endpoint `/pedidos/mis-pedidos` nuevo |
| **Estado** | ✅ Completamente funcional |

---

**Última actualización:** 10 de Diciembre, 2025
**Versión:** 1.0
**Estado:** Producción Listos
