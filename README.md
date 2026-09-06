🛠️ Tecnologías utilizadas
Frontend – React (última versión)
El proyecto utiliza React para construir toda la interfaz del Team Builder:

Renderizado dinámico del tablero de 28 casillas

Gestión de estado con hooks (useState, useEffect)

Selectores interactivos mediante SweetAlert2

Panel lateral con cálculo automático de sinergias

CRUD visual de personajes y sinergias

React actúa como cliente principal y se comunica con el backend mediante peticiones fetch enviando y recibiendo datos en formato JSON.

🌐 Backend – PHP
El backend está desarrollado en PHP, funcionando como API ligera:

Endpoints para gestionar personajes, sinergias y equipos

Recepción de datos desde React en formato JSON

Actualización de las 28 posiciones del tablero mediante consultas preparadas

Respuestas estructuradas en JSON para facilitar la integración con el frontend

El backend se ejecuta en un entorno local usando Apache.

🗄️ Base de datos – MySQL
El proyecto utiliza MySQL como sistema de almacenamiento:

Tabla de personajes

Tabla de sinergias

Tabla de equipos con 28 posiciones

Relaciones entre personajes y sinergias

La base de datos se administra y modela con MySQL Workbench, donde se gestionan las tablas, claves y relaciones.

🧪 Entorno local – XAMPP
Para ejecutar el backend y la base de datos en local se utiliza XAMPP, que proporciona:

Servidor Apache para PHP

Servidor MySQL para la base de datos

React se comunica con este backend local mediante rutas HTTP.

🔗 Conexión entre componentes
React envía peticiones fetch al backend PHP.

PHP procesa los datos y consulta la base de datos MySQL.

MySQL devuelve la información solicitada.

PHP responde a React en formato JSON.

React actualiza la interfaz en tiempo real (tablero, sinergias, personajes, equipos).
