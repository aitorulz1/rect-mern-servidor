0) creo variables.env 
    
    Aquí defino PORT y (DB_MONGO= mongodb://localhost:27017/mernstasksserver) la url donde se guardará la BBDD. Al subirla heroku lo cambiaré.



1) config -> db.js

    Aquí defino y creo la conexión con la BBDD para exportar luego a las distintas páginas como las rutas  controladores 



2) index.js

    Conectamos con la BBDD
    Habilitamos express,js
    Definimos el puerto de la app cllamando a variables.env y asignamos otro x si a caso
    Importamos rutas -> La usaremos en POSTMAN para comprobr que funciona POST y GET q creemos.
    Definimos la página principal 
    Arrancamos la app -> Muestra en la consola en que puerto estamos conectados


3) routes -> usuarios

    Aquí monto las rutas de los modelos.
    Se asigna a cada página del proyecto dónde metes las funciones que creas en el controlados sobre un modelo. Es decir, en la ruta '/' es donde se hace post cuando se crea un usuario. 

    router.post('/', usuarioController.crearUsuario);


4) modelos -> Usuario

    Creamos a estructura del modelo de información que guardaremos en la BBDD


5) usuarioController

    Definimos las acciones CRUD


6) npm i bcryptjs 

    Hashear el password
    Lo importamos a usuarioCOntroller

    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    Cuando en POSTMAN lanzamos de nuevo o creamos el usuario, en Robo 3T veremos q nos trae el password hasheado


7) npm i express-validator

    routes -> usuarios
    Antes de llamar al controlador es donde vamos a asignar nuestras validaciones.
    const { check }.
    Luego importamos en el controlador validationResult para validar esots check y revisamos si hay errores.
    Es el 238. No me funciona... Se puede poner en el modelo. Revisar Toysland...


8) JWT -> Json Web Token

    Cuando el usuario se loguea se almacena en JWT y se verifica para que pueda acceder a las distintas rutas de la app.

        Header | Payload | Signature

    Ahora en usuario Controller...

        variables.env -> Creo SECRETA= palabra secreta
        npm i jsonwebtoken

            // Crea y firmar el Json Web Token
            const payload = {
                usuario: {
                    id: usuario.id
                }
            };

            // Firmar el jwt
            jwt.sign(payload, process.env.SECRETA, {
                expiresIn:3600 // 1 hora
            }, (error, token) => {
                if(error) throw error;

                // Mensaje de confirmación
                res.json({ token });
            });

    Si todo va bien, postman te devuelve un token en referencia al id que se crea del nuevo usuario. Si vas a la web JWT -> debugger e insertas el token que te devuelve POSTMAN, obtendrás...

        usuario: {
                    id: (aquí el id de usuario que se genera en la bbdd).
                }

    Con esto vemos que el tokentiene una fórmula para crearse a partir del user id.


9) Autenticación del usuario

    Creo routes -> auth.js
    index.js -> Nueva ruta -> app.use('/api/auth', require('./routes/auth'));
    auth.js -> copio usuarios.js quitando el useuarioController y nombre, ya que el Log In solo pide email y password
    authController -> Lo creo (exports.autenticarUsuario) -> Se lo paso a auth.js



10) Revisar si el usuario existe y si el password cioncide. Creamos su JWT

    1) Encontrar usuario por email. Si no hay usuario, mensaje de que no existe
    2) Si lo encuentra, comparo el password hasheado del req con el de la BBDD. Si coincide paso al JWT
    3) Paso el JWT -> const payload -> sign. Firmamos el JWT

    Ahora en POSTMAN en localhost:3001/api-auth...

        1) Paso un correo par ver si existe y la contraseña.






