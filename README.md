# sw-movies-administrator-ms
Microservicio para la administración de películas de Star Wars

---

# Requisitos

Node.js: versión recomendada >= 16.
npm: npm incluido con Node.js.
Base de datos: MySQL/MariaDB para ejecución normal. Para e2e puede usarse SQLite/memoria según configuración de tests.

---

# Instalación y configuración del proyecto

1. Clonar proyecto con comando `git clone <repo>`
2. Instalar dependencias con comando `npm install`
3. Configurar archivo .env o local.env para las variables de entorno, las cuales son:
 ```env
# Argon2id variables:
ARGON2ID_MEMORY_COST=19456
ARGON2ID_TIME_COST=2
ARGON2ID_THREADS=1

#JWT variables:
JWT_SECRET=tu_secreto_muy_seguro_y_largo

#Database variables:
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SYNCHRONIZE=false
```

---

# Ejecución del proyecto

Para desarrollo: Correr proyecto con comando `npm run start:dev`
Para producción: Correr proyecto con `npm run start:prod`
Para buildear proyecto: `npm run build`

***Este proyecto utiliza Swagger UI para la visualización, documentación y prueba de los endpoints.***
¿Cómo acceder a SwaggerUI para este proyecto? Accediendo a esta ruta localmente: 'http://localhost:3000/api'

<img width="1361" height="711" alt="image" src="https://github.com/user-attachments/assets/9c956229-ca93-4d54-85d1-751fb0a204e9" />

---

# Arquitectura del proyecto

Este proyecto sigue la arquitectura API REST, construída con NestJs, con un sistema modular y por capas (Similar a un MVC, con sus repositorios/entidades, servicios, controladores). Lo cual resulta óptimo a la hora de añadir más funcionalidades, ya que basta con crear un nuevo módulo, añadirlo al app.module y testear.

---

# Estructura del proyecto

Este microservicio tiene posee varias funcionalidades, separadas por módulos:

**Módulos principales:**

* Autenticación (auth-module):
Este módulo se encarga del registro y autenticación de usuarios para la aplicación de películas de Star Wars. Presenta dos endpoints `register` y `login`.
Para el método `register` se realizan varias operaciones:
1. Verificar si el usuario existe (Para lo cual se invoca al método findByEmail). Si el usuario existe se larga excepción indicando que la dirección de email ya se encuentra registrada, sinó se continúa con la lógica.
2. Se hashea la contraseña indicada por el usuario, para eso se utiliza la librería `Argon2id`. Esta librería se puede utilizar para verificar tokens JWT, y resulta más robusta que otras alternativas como `bcrypt`, ya que soporta ataques de canal lateral y de intercambio tiempo-memoria, además de que está recomendada por OWASP para este tipo de finalidades y nuevas aplicaciones que requieran este tipo de funcionalidad.
3. Si la contraseña se hashea correctamente entonces se crea el usuario, invocando al método `create` del `userService`, aquí se indican los parámetros del dto pasado via controller, así como la contraseña hasheada.
4. Si este paso resulta ok, entonces se retorna el resultado.

Para el método `login` se realizan las siguientes operaciones:
1. Validar el usuario, invocando el método `validate` del mismo auth.service, donde se comprobará el hash almacenado en la db contra la contraseña indicada desde el dto via controller. Si esto da ok seguimos, sino retorna unauthorized exception, por credenciales inválidas.
2. Se setea el payload con las propiedades del usuario validado.
3. Se retorna el access_token firmado con el jwtservice, y los datos del usuario.

* Usuarios (user-module):
Este módulo tiene dos métodos, `create` y `findByEmail`, el primero se establece para la creación de usuarios en la tabla `users` (Al registrarse), y el segundo para la búsqueda de usuarios por email (para lo cual se utiliza la ORM `TypeORM`).

* 

  Diagrama simple de estructura del proyecto:
 ```text
AppModule
  ├─ AuthModule
  │    ├─ AuthController
  │    │    ├─ POST /auth/register
  │    │    └─ POST /auth/login
  │    └─ AuthService
  │         └─ UsersService
  │              └─ User entity
  │
  ├─ UsersModule
  │    └─ UsersService
  │         └─ User entity
  │
  └─ MoviesManagementModule
       ├─ MoviesManagementController
       │    └─ /movies-management/*
       └─ MoviesManagementService
            ├─ Movie entity
            └─ HttpService (SWAPI sync)
 ```