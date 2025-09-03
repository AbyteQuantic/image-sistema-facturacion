imaginamos-sistema-facturacion
Este proyecto es un sistema de facturación basado en microservicios con NestJS. Hay un API Gateway como entrada única y varios servicios que se comunican entre sí por TCP (JSON).
Autenticación con JWT; datos en PostgreSQL (usuarios) y MySQL (inventario, proveedores, clientes, facturas).
¿Qué hay aquí?
/api-gateway/           # HTTP → TCP. Autenticación, ruteo y manejo de errores
/auth/                  # Registro y login. Emite/valida JWT (PostgreSQL)
/inventory/             # Productos y stock (MySQL)
/suppliers/             # Proveedores (MySQL)
/customers/             # Clientes (MySQL)
/billing/               # Facturas y devoluciones; sincroniza stock (MySQL)
/docker/                # Scripts y configs opcionales
docker-compose.yml
Cómo se hablan los servicios
El Gateway recibe HTTP y lo traduce a mensajes TCP (JSON).
Cada micro expone patrones (ej. billing.createInvoice) y responde por TCP.
Billing notifica a Inventory para ajustar stock en ventas/devoluciones.
Balanceo simple: el Gateway puede abrir varios ClientProxy y rotar (round-robin).
Requisitos
Docker y Docker Compose
(Opcional) Node 20+ y npm si quieres correr algo fuera de contenedores
Configuración rápida
ejecuta los ejemplos de entorno:
cp .env.example .env                # si existe a nivel raíz
# o, por servicio:
cp api-gateway/.env.example api-gateway/.env
cp auth/.env.example auth/.env
cp inventory/.env.example inventory/.env
cp suppliers/.env.example suppliers/.env
cp customers/.env.example customers/.env
cp billing/.env.example billing/.env
Variables típicas:
# API Gateway
PORT=3000
JWT_SECRET=supersecreto
AUTH_TCP_HOST=auth
AUTH_TCP_PORT=4001
INVENTORY_TCP_HOST=inventory1
INVENTORY_TCP_PORT=4002
SUPPLIERS_TCP_HOST=suppliers
SUPPLIERS_TCP_PORT=4003
CUSTOMERS_TCP_HOST=customers
CUSTOMERS_TCP_PORT=4004
BILLING_TCP_HOST=billing1
BILLING_TCP_PORT=4005

# Auth (PostgreSQL)
PG_HOST=postgres
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=auth

# MySQL (para inventory/suppliers/customers/billing)
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=secret
MYSQL_DB=inventory   # o suppliers / customers / billing según el servicio
Levantar todo
docker compose up -d --build
# logs (en vivo)
docker compose logs -f
Prueba de vida:
curl http://localhost:3000/health
Flujo de uso (rápido)
Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.pujol","password":"carlosdoño"}'
Login → token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.pujol","password":"carlosdoño"}'
# copia "access_token"
Productos
TOKEN=pega_aqui_el_token

# crear
curl -X POST http://localhost:3000/inventory/products \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Teclado", "sku":"SKU-1", "price":99.90, "stock":10}'

# listar
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/inventory/products
Clientes / Proveedores (similares)
# cliente
curl -X POST http://localhost:3000/customers \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Acme", "email":"acme@example.com", "phone":"+51..."}'

# proveedor
curl -X POST http://localhost:3000/suppliers \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Proveedor Uno", "contactEmail":"ventas@proveedor.com", "phone":"+57..."}'
Factura y devolución
# crear factura
curl -X POST http://localhost:3000/billing/invoices \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
        "customerId":"<id-cliente>",
        "items":[{"productId":"<id-producto>","quantity":2,"price":99.90}]
      }'

# devolver un ítem
curl -X POST http://localhost:3000/billing/invoices/<id-factura>/return \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"productId":"<id-producto>","quantity":1}'
Endpoints (resumen)
POST /auth/register – crea usuario
POST /auth/login – devuelve access_token
GET /inventory/products | POST /inventory/products | GET/PATCH/DELETE /inventory/products/:id
GET/POST/PATCH/DELETE /suppliers (idempotente por :id)
GET/POST/PATCH/DELETE /customers
GET/POST /billing/invoices | POST /billing/invoices/:id/return
Todos los endpoints (menos auth/*) requieren Authorization: Bearer <token>.
Pruebas
Unitarias e integración por servicio:
docker compose exec auth npm run test
docker compose exec inventory1 npm run test

Capturas e las pruebas:
# Heaqlth
 <img width="1316" height="84" alt="Captura de pantalla 2025-09-02 a la(s) 9 14 57 p m" src="https://github.com/user-attachments/assets/e8a2b09b-cca1-4128-b944-ac2e1616dd24" />
# crear usuario y logging
<img width="1316" height="272" alt="Captura de pantalla 2025-09-02 a la(s) 9 24 08 p m" src="https://github.com/user-attachments/assets/fb11a312-6a87-4110-8585-9a5459a39fff" />
# listar usuario
<img width="1312" height="126" alt="Captura de pantalla 2025-09-02 a la(s) 9 25 52 p m" src="https://github.com/user-attachments/assets/e25a6279-e6ae-4cc0-be7e-a025346dfac7" />
# Productos
<img width="1313" height="258" alt="Captura de pantalla 2025-09-02 a la(s) 9 27 07 p m" src="https://github.com/user-attachments/assets/4896fcb9-877f-444d-9b73-81e820946916" />
<img width="1318" height="144" alt="Captura de pantalla 2025-09-02 a la(s) 9 27 24 p m" src="https://github.com/user-attachments/assets/72d1490b-a1e0-43b3-9321-492d2db4fdb0" />
<img width="1322" height="114" alt="Captura de pantalla 2025-09-02 a la(s) 9 27 53 p m" src="https://github.com/user-attachments/assets/7164ca28-e0b4-4575-9381-1f2160f84314" />
<img width="1327" height="263" alt="Captura de pantalla 2025-09-02 a la(s) 9 29 28 p m" src="https://github.com/user-attachments/assets/ca7cf2d8-5d3d-4134-b6fc-a0746f703156" />
<img width="1047" height="89" alt="Captura de pantalla 2025-09-02 a la(s) 9 31 43 p m" src="https://github.com/user-attachments/assets/918e66f6-6c6b-4534-9f11-84ae4c966de6" />
# Proveedores (supliers)
<img width="1311" height="118" alt="Captura de pantalla 2025-09-02 a la(s) 9 32 40 p m" src="https://github.com/user-attachments/assets/6a7db30d-9e44-477c-8650-8334bbaf122a" />
<img width="1320" height="274" alt="Captura de pantalla 2025-09-02 a la(s) 9 33 52 p m" src="https://github.com/user-attachments/assets/2f331aa3-e1f5-4e4d-8827-2c7c0f1f820d" />


