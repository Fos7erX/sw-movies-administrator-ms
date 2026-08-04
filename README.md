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
3. Se retorna el access_token (JWT) firmado con el jwtservice, y los datos del usuario.

* Usuarios (user-module):
Este módulo tiene dos métodos, `create` y `findByEmail`, el primero se establece para la creación de usuarios en la tabla `users` (Al registrarse), y el segundo para la búsqueda de usuarios por email (para lo cual se utiliza la ORM `TypeORM`).
***Nota importante:*** En la tabla users se setearán 2 tipos de roles, `user` y `admin`, los entrarán en juego para el módulo de administración de películas, bajo el Guard `RolesGuard`.

* Movies Management (movies-management-module):
Este módulo tiene como funcionalidad la administración de películas. Aquí tenemos varias funcionalidades:
1. Uso de Guards (`JWTAuthGuard` para validar el jwt retornado por el método login, y `RolesGuard` para la validación de roles de usuario).
2. Uso de decorador `@Roles`, el cual nos sirve para determinar que el endpoint se utilizará solamente para un determinado tipo de rol (user o admin).

En cuanto a los endpoints, podemos observar:
1. `get-all-movies`: Este endpoint retorna todas las películas. Aquí primero se verifica que no haya peliculas existentes en la tabla `movies`. Si esta se encuentra vacía, entonces se recurrirá a sincronizar la tabla con las películas de la api de Star Wars, y se retornarán todas las películas existentes. Este endpoint no discrimina por rol de usuario.
2. `get-by-detail`: Este endpoint retorna una película por id, si no se encuentra entonces se retorna por excepción (Not Found Exception), y si se encuentra, se retorna la película deseada. Este endpoint discrimina por rol, necesita ser USER.
3. `create-movie`: Este endpoint crea una nueva película en la tabla `movies`, en caso de no existir. Este endpoint discrimina por rol, necesitar ser ADMIN.
4. `update-movie`: Este endpoint actualiza una nueva película ya existente en la tabla `movies`. Este endpoint discrimina por rol, necesitar ser ADMIN.
5. `delete-movie`: Este endpoint elimina una nueva película ya existente en la tabla `movies`. Este endpoint discrimina por rol, necesitar ser ADMIN.
6. `sync-movies-from-api`: Este endpoint sincroniza la tabla `movies` con la api de Star Wars. Este endpoint discrimina por rol, necesitar ser ADMIN.
   
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

---

# Tests

Este proyecto posee tanto pruebas unitarias como tests e2e, ambos con la librería ***Jest***.

Para ejecutar pruebas unitarias (unit tests): `npm run test`
Para ejecutar pruebas e2e (end to end): `npm run test:e2e`
Para ejecutar ambos comandos (unit tests y e2e): `npm run test && npm run test:e2e`

En caso de que las pruebas pasen, debería figurar algo tal que asi en la consola:

<img width="704" height="603" alt="image" src="https://github.com/user-attachments/assets/1dcb3e7b-0a5d-41c5-bc96-28763005a541" />


