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

    3 ) Donde se encontraba el nombre... usuario.nombre. Por esto hemos traído usuario.



14) Crear cerrar sesión de usuario

    1) En Barra.js creamos el botón de cerrar sesión o le ponemos el onClick.
    2) authState -> Creamos la función cerrarSesion().
    3) Solo le pasamos un dispatch type: CERRAR_SESION
    4) en Barra.js extraemos cerrarSesions



15 ) Proteger un componente. Si no hay credenciales no se puede acceder a ciertas bases

    1) Components -> RutaPrivada.js
    2) Importamos useContext, useEffect, Route Redirect, AuthContext
    3) Creamos nuestro HIgher Order Component
    4) En ella declaramos que una ruta privada tiene dentro otro componente -> component: Component, ...props
    5) Creamos el aithContext y le pasamos el context para extraer autenticado (de momento)
    6) Agregamos un Route y dentro de este una copa de los props y un render que ejecuta que si un usuario no esta autenticado, pasará algo y si lo está, pasará otra cosa.
    7) Redirect lo usaremos para definir dónde enviar al usuario si no está autenticado.
    8) App.js -> Importamos RutaPrivada
    9) Cambio las rutas que consider con RutaPrivada 
    10) Incorporamos usuarioAutenticado porque cuando te registras y refrescas, se pierde y pierdes la autenticación en RutaPrivada.
    11) Extraemos en RutaPrivada usuarioCAutenticado ya que es el que tiene el token y la llamamos en un useEffect
    12) Meto los datos de registro y cuando se carga, se ejecuta esa función y ya estoy autenticado

    13) Al cargar hay un problema que se ve como si se cargara así que voy ak authState  y agregamos un nuevo elemtnto en initialState...
        cargando: true

    14) Añadimos en RutaPrivada una nueva condición en la que ya había de: si no esta cargando, entonces redirecciona a home. Así desaparece el flash que aparecía.



------------- Creando Proyecto -------------

    
1) Creando el Proyecto

    1.1) proyectoState -> Agregar nuevo Proyecto le inserto un try catch. Ya traía proyecto como payload así que añado async antes del try catch.
    1.2) Traigo clienteAxios porque voy a interctuar con la BBDD
    1.3) Console -> user messaes -> Aquí veo data y dentro me dice...
        creado
        creador
        nombre
        id
    1.4) Meto dentro el dispatch y en vez de pasarle proyecto, le paso resultado.data
    1.5) COmpruebo en Robot 3T que me crea el proyecto en a BBDD. 

2) Listar los Proyectos | 276

    2.1) proyectoState -> obtenerProyectos
    2.2) Elimino el dispatch y lo inserto dentro del try en try catch
    2.3) con const resultado, llamo a la BBDD y con get obtengo los proyectos, pero no sin antes cambiar en payload "proyecto" por "resultado.data.proyectos".

    *Para comprobar qué debo de pasar o la estructura ("resultado.data.proyectos"), puedo ir al REDUCER y en OBTENER_PROYECTOS le hago console.log(action.payload) ->

    case OBTENER_PROYECTOS:
        console.log(action.payload);

    Nos mostrará la ruta adecuada.

    2.4) Si voy ahora a mi cuenta con mi correo, veo los proyectos que he creado.
    2.5) Voy a ListadoProyectos.js y donde le paso a Proyecto el key de proyecto.id, le pongo un guión bajo -> proyecto._id

    Mongo lo ve así. Antes no hacía falta pero ahora hay que cambiarlo para que no nos de un error.


3) Obtener un Proyecto en activo 277

    3.1) Proyecto.js
    3.2) voy a onClick y en la ruta  
    onClick= {() => seleccionarProyecto(proyecto.id)} 
        lo cambio por  
    onClick= {() => seleccionarProyecto(proyecto._id)}

    3.3) Reducer -> Lo mismo... en case PROYECTO_ACTUAL, en el return, inserto el ._id


4) Eliminar el Proyecto 278

    4.1) ListadoTareas.js
    4.2) Lo mismo que antes, voy al id que recoge onClick, que ene este caso se recoge en el boton pero pasa a una función que está haciendo scroll hacia arriba y cambio .id por ._id
    4.3) También lo modifico en el Reducer.
    4.4) ProyectoState -> en const eliminarProyecto hago lo mismo, async y try catch!

    En este caso podemos pasar el await directamente en el try, sin const resultado...

    try {
            await clienteAxios.delete(`/api/proyectos/${proyectoId}`)
            dispatch({
                type: ELIMINAR_PROYECTO,
                payload: proyectoId
            })


5 ) Mostrar alerta si hay errores | 279 -> Explica las alertas de errores

    5.1) Agregamos nuevo type para PROYECTO_ERROR
    5.2) Lo agregamos a proyectoState
    5.3) Pasamos a eliminarProyecto el dispatch de PROYECTO_ERROR
    5.4) En el initialState creamos mensaje: null y lo pasamos al provider
    5.5) Creamos ene l catch la const alerta que contiene msg y categoria y lo pasamos como payload.
    5.6) Vamos a reducer y a mensaje le pasamos el action.payload

    5.7) ListadoProyectos.js -> importamos AlertaContext y extraemos alerta y mostrarAlerta
    5.8) De proyectosContext extraemos mensaje
    5.9) en el useEffect decimos que si hay mensaje, que mostrarAlerta(mensaje.msg, mensaje.categoria)
    5.10) En el rretun creamos la alerta.
    {alerta ? ... : ...
    
    5.11) Se lo paso al resto de funciones



6) Insertando Tareas | 280

    6.1) TareaState -> agregar Tareas -> try catch y le hago un post a clienteAxios con la ruta /api/tareas
    6.2) TareaReducer _> cambio tareas por proyectoTareas. En el initial state he borrado tareas y proyectoTareas de null, pasa a se un [].
    6.3) FormTareas -> if(tareaseleccionada...) cambio proyectoActul.id por proyectoActul._id
    6.4) en el mismo sitio... tarea.proyectoId = proyectoActual._id -> tarea.proyecto xq en las rutas de tarea estamos enviando 'nombre' y 'proyecto' y en el modelo igual, lo paso como 'proyecto'.
    El estado lo borro por que en el initialState está como false, por lo que cuando cambie, pasa a true.
    6.5) Ya puedo agregart tareas




7) Obteniendo las tareas del Proyecto | 281

    7.1) tareaState -> Obtener tareas (Consultar a la BBDD con try catch.)
    7.2) Cada tarea tenemos que pasarle el proyecto en el que esta.
    7.3) Si debajo de obtenerTareas hago un console.log(proyectoId) vemos que al seleccionar un proyecto sale el proyecto id.
    7.4) Lo renombranmos a 'proyecto'. En Proyecto.js en const seleccionarProyecto ya le estamos pasando el id.
    7.5) Tengo que pasar el proyecto al axios para obtener las tareas.
    7.6) en const resultado paso proyecto como un params. Si hago console.log en tareasController, lo leo como req.query. en tareasController, en obtenerTareas, en el controller, si hago un console.log(req.params) y selecciono un proyecto, en la terminal me indica su id.
    7.7) Si seleccionoun proyecto, en console, veo el array de tareas, pero aún no las muestra.
    7.8) tareasReducer -> TAREAS_PROYECTO. Quito el filter y pongo action.payload ya que no hace falta hacer un filtro ya que axios ya me está trayendo esas tareas.



8) Eliminar Tareas

    8.1) components -> tareas -> Tarea.js. Tengo que ir a la función que recoge el id de la tarea y poner el guión bajo...
    onClick= { () => tareaEliminar(tarea._id) }

    en tareaEliminar, eliminarTarea(id) recoge el valor adecuado así que no debemos de cambiar el id. Lo digo por si decía tareaId.

    8.2) tareaState -> eliminarTarea -> try catch. Solo usamos await porque vamos a eliminar.
    8.3) Para eliminar una tarea, vemos en el controller que debemos de pasarle el proyecto tareasController -> eliminarTarea -> const { proyecto } = req.body. Por lo que en Tareas.js, a eliminarTarea, además del id le tenemos que pasar el proyecto actual...

    eliminarTarea(id, proyectoActual._id)

    Tenemos que pasar el id al backend para mostrar q somos los creadores de ese proyecto.

    8.4) areaState -> en async le pasamos entonces async(id, proyecto) y en el await le pasamos de nuevo params: { protyecto }

    8.5) Volvemos al controller de tareas y cambiamos req.body por req.query ya que le pasamos params en el State

    8.6) tareaReducer: a ELIMINAR_PROYECTO tenemos que agregarle a tarea.id -> tarea._id




9) Editar Tarea

    Para editar tarea tenemos 2 métoo que son...

    - cambiarEstado (para cambiar de completo a incompleto)
    - actualizarTarea

    Los dos hacen lo mismo. Es un put a terea y lo que vamos a hacer es eliminar cambiarEstado, el cual lo estoy usando en Tarea.js por loq ue tendré que eliminar del destructutrin y de luna función y cambiarlo por actualizarTarea.

    Ambos toman tarea

    9.1) Hacemos console.log(tarea) y seleccionamos una tarea y nos da toda la información
    9.2) tareaState -> actualizarTarea -> try catch

    const resultado = await clienteAxios.put(`/api/tareas/${tarea._id}`, tarea)

    Le paso tarea para que la reescriba.

    9.3) console.log(resultado) y vemos toda la información de la tarea. data. tarea. Por esto el payload es resultado.data.tarea

    9.4) tareaReducer -> ACTUALIZAR_TAREA y tarea.id -> tarea._id; action.payload.id -> action.payload._id

    9.5) Si cambio el estado se cambia a completo, pero si vuelves a clickar no cambia a incompleto.

    9.6) tareaController .> const nuevaTarea debo de quitarle los if.