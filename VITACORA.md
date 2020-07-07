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





---------------------------------------------


11) Creo el modelo Proyecto

    Se compone de nombre (de proyecto), creador (el id del usuario) y creado (fecha)


12) Routes -> Proyecto (tendrá rutas para crear, editar, eliminar) y su proyectoController

    1) Creo el modelo
    2) Creo el controlador -> requiere importar el modelo -> Crear proyecto
    3) Creo la ruta -> requiere express, router y el controlador -> Indico la ruta en la q se posteará el nuevo poyecto
    4) index.js -> Importo la nueva ruta de proyectos -> app.use('/api/proyectos', require('./routes/proyectos'))


13) proyectoController

        let proyecto = new Proyecto(req.body);

        proyecto.save; 
        res.json(proyecto)

        Voy a POSTMAN, creo una nueva ruta con /api/proyectos y en el body inserto solo un nombre y envío. Me crea un proyecto con su nombre, su id y su fecha de creación.
        Ahora tengo que asignarle el id del usuario que lo ha creado.


14) Creo MIDDLEWARE folder y dentro auth para autenticar proyectos

    0) Creo auth. -> Importo jsonwebtoken

    1) Leer el token -> const token = req.header('x-auth-token')
    2) Revisar si no hay
    3) Validar el token
    4) A proyecto agregarle el usuario.id

Se valida y se asignaun proyecto se relaciona con el usuario que lo crea.


15) Hago una validación para ver si si los campos en proyecto están vacíos por lo que voy a proyectos.js y después del auth, lo paso un check.

Voy a proyectoController => 
Si hay errores, validación los va a detectar y los colocará en el array.



16) Vamos a traer los proyectos del usuario q está autenticado

    1) En el proyectoController creo  obtenerProyectos que paso a proyectos.js, en la ruta del get.
    2) En el Controller tengo el modelo de Proyecto importado
    3) Creo en try un const proyectos que hace un find en el modelo Proyecto y le paso como condición el id del usuario.


17) Desde aquí lo que hemos hecho es crear los controladores y el CRUD para proyectos y tareas (ver POSTMAN)



        -------------------------

        Unir la parte del Fontend con Backend

        -------------------------

1) En la carpeta context creo una nueva llamada alertas y creo los archivos Context, Reducer, State

2) En state creo AlertaState y MostrarAlerta donde la primera indica cómo se encuentra de forma inicial el state y la segunda una vez coja el valor del payload, lo pase a las funciones en el Reducer.

3) App-js -> Insertamos el nuevo State  <AlertaState> que envuelva el Router.

4) Voy a NuevaCuenta donde vamos a importa el alerta context, añado useContext y extraigo los valores del context con destructuring

    //extraer los calores del alertaContext
    const alertaContext = useContext(AlertaContext);
    const { alerta, mostrarAlerta} = alertaContext

 Hacemos un ternario con alerta (que tiene su valor a null) en el form y en caso de que haya alerta, tenga algo

Ponemos las validaciones y cuando las pase...

5) Crear cuentas y autenticación desde react -> 

    Creamos las variables de entorno... Es decir, que los valores de registro en el forulario lo pasaremos a nuestro REST API.

    cliente -> creamos nuevo archivo ->  .env.development.local

        REACT_APP_BACKEND_URL=http://localhost:3001     (Es la ruta de localhost que usé en POSTMAN)

    Detengo el servidor e instalo axios en cliente

    De nuevo arranco el servidor (npm start)

    Ahora hacemos referencia a esta cariable.

    src -> onfig -> axios.js

    Creamos nuestro cliente axios que lo vamos a utilizar mucho a lo largo del proyecto.






6) authState  |  video 263

    Cremos las funcione que van a permitir crear un nuevo usuario

    La función consistirá en un try catch.

    Indicamos que si va bien, en la ruta de crear usuario (api/usuarios) le insertamos los nuevos datos.

    Si va bien, entonces dispatch: REGISTRO_EXITOSO
    Si va mal,  entonces dispatch: REGISTRO_ERROR

    Ahora vamos al reducer y definimos REGISTRO_EXITOSO y REGISTRO_ERRROR

    Recordamos que si vamos usuarioController, la respuesta que nos va a dar es el token (ver usuarioController). Pasamos ese token como payload.


    components -> auth -> NuevaCuenta e importo el context de autenticacion (AuthContext) y extraemos los valores del context con...

    const authContext = useContext(AuthContext);
    const { registrarUsuario} = authContext;

    Abajo del todo antes del form, cuando pasamos la validaión de nueva cuenta, pasamos registrarUsuario({nombre, mail, password})

    Esto que recoge, se lo pasa al state y pasa los datos a const registrarUsuario y se los pasa a la API, tenemos una respuesta y pasa a EGISTRO:EXITOSO o ERROR.





7) Habilitar cors y creando usuario

    Los cors te permiten recibir peticiones de otro dominio. Instalamos en el SERVIDOR npm i cors
    Abrimos el index.js del servidor e importamos cors

    Arrancamos el servidor con 'npm run dev'. Antes mongod y mongo. Conectada en el 3001. Borramos los usuarios que podamos tener. Borramos en Robo 3

    Ahora completamos formulario de Registro y en authState que hemos puesto console.log(respuesta), vemos lo que nos trae axios. Vemos que en console nos pone data. Se lo añadimos al concole.log(respuesta.data).

    Me devuelve el token en la respuesta.

    Ahora en el disptach de la función de registrarUsuario, pasamos como respuesta el token, es decir, respuesta.data.

    Ahora el reducer de RESPUESTA_EXITOSA guarda el payload, el token en el localStorage.

    De nuevo borramos el usuario que he creado y en consola, voy a "Application" y se registro un nuevo uuario, veo como guarda el token en localStorage.




8) Autenticar y redirigir a proyectos después de registro


    AuthState -> en registrarsuario, si hay error entonces metemos en una constante alerta el mensaje y la clase (categoría) de esa alerta y se lo pasamos al dispatch. En console y en Components del navegador vemos que nos pinta el error.

    El dispatch recoge alerta y lo pasa al reducer.

    NuevaCuenta: Aquí en el destructuring pasamos autenticado y mensaje.

    Creamos un useEffect en el que...

        - Si el usuario esta autenticado, entonces enviamos al usuario a proyecto mediante props.history.pus('/proyectos/')
        - Si ya estaba registrado entonces le paso el mostrarAlerta con el mensaje que le corresponde y su clase.




9) Obteniendo información del usuario autenticado . 265

    authState: Nueva función para traer al usuario autenticado.

    Si tiene token entonces traemos a través de clienteAxios.get de la ruta ('/api/auth').

    Vamos a router auth y creamos la nueva ruta y su controllador en authCOntroller en el que si el usuarioAutenticado...
     hace un findById. El middleware de auth guarda en el usuario autenticado. Si pongo (req.usuario.id) en el controlador, me va a traer todo el registro del usuario o del que tenga el id que estamos enviando.

     Es decir, si el usuario esta autenticado, taeme usuario y en json me pintas ese usuario que encuentras por el id.

     authState -> ahora obtenemos ese usuario con usuarioAutenticado();



10 ) Enviando el token por headers

    En el middleware de auth Token es donde se encenra x-auth-token en req.header.

    Tenemos que enviarlo por lo que en config del cliente creamos un archivo nuevo llamado token.js en el que creamos la función tokenAuth y le pasamos en nuestro clienteAxios el x-auth-header

    Creamos un función en la que si hay token, lo pasamos en header y sino, lo vamos a eliminar.

    authState -> Importamos el tokaenAuth que hemos creado en el config del cliente y ahora sí que identifica la función el TODO de si hay token o no.

    Si hay token, le pasamos esta función con el token de localStorage y va a colocarlo en header.

    entonce...

    usuarioAutenticado, si tiene el token, entonces tra por id ese usuario y al método OBTENER_USUARIO en el reduce, hace una copia del state y a usuario le pasa el action.payload(El usuairo registrado y autenticado).

    En el authController le ponemos el método a la función .select('-password') para que no traiga ese campo



11) INICIAR SESION

    Aquí lo que hacemos es...

        1) Crear una función en authState iniciarSesion
        2) hace un post al auth/api con los datos de registo del usuario (Email y password)
        3) paso esta función de iniciarSesión al context que lo lleva a Login
        4) En Login, validamos los errores que no estén los campos de email y password vacíos
        5) Autenticado, inicarSesion recoge los datos y los trae al  authState

        6) Estos datos los posteamos y en dispatch le pasamos al método LOGIN_EXITOSO como payload la respuesta, que es el token
        7) En Reducer, al igual que LOGIN_EXITOSO autenticado: true, mensaje: null
        8) En el authState, una vez pasa LOGIN_EXITOSO, declaramos la función...
         usuarioAutenticado()
         Nos tare usuario. Lo montamos antes con NuevaCuenta declarando en la ruta y en athController. Si tiene token, encuentralo por id al usuario y traelo con json.
        9) EN Login gracias a props.history.push('/proyectos'), cuando esta autenticado, redirige a proyectos



12) Autenticar al usuario aunque se recargue la app

    1) Abrimos App.js y revisamos si tenemos un toke. Si lo tenemos cargamos nuestro config de token (tokenAuth) que lo que hace esta función es coger el token y pasarlo por header

    2) Abrimos Proyectos y allí donde quiera utilizar las diferentes o toda ls info del usuario, tendré que escribir el siguiente código 

        2.1) Exportar con context el usuarioAutenticado(); Esta función revisa si hay un token. Lo pasamos para extraer en Proyectos la información de autenticación.

        2.2) Lo metemoen Proyectos en useEffect para que, cuando se actualice la página, tengamos esta información.

        Ahora aunque recargue la página, sigo autenticado



13) Mostrar qué persona es la que está autenticada (Barra.js)

    1) Copio los context de auth (usuario y usuarioAutenticado)) y el useEffect para que cargue la info cuando haya cagado la página.

    2) Puede ser que cuando carguemos este componente no tenga ningún usuario, por lo que crearemos un ternario qie si usuario existe, pinta este código y sino null.

    3 ) Donde se encontraba el ombre... usuario.nombre. Por esto hemos traído usuario.


14) Crear cerrar sesión de usuario

    1) En Barra.js creamos el botón de cerrar sesión o le ponemos el onClick.
    2) authState -> Creamos la función cerrarSesion().
    3) Solo le pasamos un dispatch type: CERRAR_SESION
    4) en Barra.js extraemos cerrarSesions