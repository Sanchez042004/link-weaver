# 🚀 Guía de Pruebas de API con Postman

Esta guía te ayudará a probar los endpoints de **Link Weaver** usando Postman.

## 1. Configuración Inicial

1.  Abre **Postman**.
2.  Crea una **Nueva Colección** llamada `Link Weaver`.
3.  (Opcional) Configura una variable de colección `baseUrl` con valor `http://localhost:3001/api`.

---

## 2. Autenticación

### A. Registrar Nuevo Usuario (`/auth/register`)

1.  Crea una nueva request: **Add Request** -> "Registrar Usuario".
2.  Método: **POST**
3.  URL: `http://localhost:3001/api/auth/register`
4.  Pestaña **Body** -> Selecciona **raw** -> Selecciona **JSON** (en el dropdown azul).
5.  Pega el siguiente JSON:
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "password123",
      "name": "Mi Nombre"
    }
    ```
6.  Dale a **Send**.
7.  Deberías ver un status `201 Created` y el token en la respuesta.

### B. Iniciar Sesión (`/auth/login`)

1.  Nueva request: **Add Request** -> "Login".
2.  Método: **POST**
3.  URL: `http://localhost:3001/api/auth/login`
4.  **Body** -> **raw** -> **JSON**:
    ```json
    {
      "email": "usuario@ejemplo.com",
      "password": "password123"
    }
    ```
5.   dale a **Send**.
6.  **IMPORTANTE:** Copia el `token` que viene dentro de `data.token` en la respuesta. Lo necesitarás para el paso 3.

---

## 3. URLs (Acortador)

### A. Crear URL Corta (Anónimo)

1.  Nueva request: "Crear URL Anónima".
2.  Método: **POST**
3.  URL: `http://localhost:3001/api/urls`
4.  **Body** -> **raw** -> **JSON**:
    ```json
    {
      "longUrl": "https://www.google.com/search?q=gatos+graciosos"
    }
    ```
5.  **Send**. Recibirás tu `shortUrl`.

### B. Crear URL Corta (Autenticado - Asociada a tu usuario)

1.  Nueva request: "Crear URL Autenticada".
2.  Método: **POST**
3.  URL: `http://localhost:3001/api/urls`
4.  **Autenticación**:
    -   Ve a la pestaña **Authorization**.
    -   En "Type" selecciona **Bearer Token**.
    -   En el campo "Token", pega el código gigante que copiaste en el paso de Login.
5.  **Body** -> **raw** -> **JSON**:
    ```json
    {
      "longUrl": "https://github.com",
      "customAlias": "mi-github" 
    }
    ```
    *(El customAlias es opcional)*
6.  **Send**. Verás que en la respuesta el `userId` ya no es `null`.

---

## 4. Tips Pro para Postman

### Automatizar el Token
Para no tener que copiar y pegar el token cada vez:

1.  En la request de **Login**, ve a la pestaña **Tests**.
2.  Pega este código:
    ```javascript
    var jsonData = pm.response.json();
    pm.collectionVariables.set("jwt_token", jsonData.data.token);
    ```
3.  En tu colección, pestaña **Authorization** (click en la carpeta de la colección):
    -   Type: **Bearer Token**
    -   Token: `{{jwt_token}}`
4.  Ahora, todas las requests dentro de la colección heredarán el token automáticamente si seleccionas "Inherit auth from parent".
