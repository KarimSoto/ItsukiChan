let cantidadDemanda = 1;
let cantidadOferta = 1;
let list = [];
let demanda = [];
let oferta = [];
let tin = document.getElementById('tabla-in');
let thead = tin.querySelector('thead'); 
let tbody = tin.querySelector('tbody');
let aviso = document.querySelector('.warning');
let mensaje = aviso.querySelector('span');
let cantidad = document.querySelector('.cantidad');
let boton  = document.getElementById('hde');
var t=0;

function DemandaMenos(){

    if(cantidadDemanda>1){

        cantidadDemanda-=1;

        // Eliminar un th en el tr
        let trThead = thead.children[0];
        let ths = trThead.children;
        ths[ths.length-1].remove();

        let trs = tbody.children;
        for(let tr=0;tr<trs.length;tr++){
            tds = trs[tr].children;  // Acceder a los tds
            tds[tds.length-1].remove();
        }
    }
    
}

function DemandaMas(){

    cantidadDemanda+=1;

    // Agregar un td 'demanda' para el primer tr
    let th = document.createElement('th');
    let inp = document.createElement('input');
    inp.setAttribute('type','number');
    inp.setAttribute('class','demanda');
    inp.setAttribute('placeholder','0.0');
    th.append(inp);

    let trThead = thead.querySelector('tr');
    trThead.append(th);

    trs = tbody.children;
     
    for(let i=0;i<cantidadOferta;i++){
        let td = document.createElement('td');
        let inp = document.createElement('input');
        inp.setAttribute('type','number');
        inp.setAttribute('class','celda');
        inp.setAttribute('placeholder','0.0');
        td.append(inp);
        trs[i].append(td);   // En cada tr vamos a agregar un td
    }
}

function OfertaMenos(){

    if(cantidadOferta>1){

        // Reducir la cantidad de ofertas
        cantidadOferta-=1;

        // Si puede eliminar una celda
        let trs = tbody.children;
        let lastTr = trs[trs.length-1];
        lastTr.remove();
    }

}

function OfertaMas(){
    cantidadOferta+=1;
    
    let tr = document.createElement('tr');

    // Esto es para la primer celda
    let tdf = document.createElement('td');
    let inpf = document.createElement('input');
    inpf.setAttribute('type','number');
    inpf.setAttribute('class','oferta');
    inpf.setAttribute('placeholder','0.0');
    tdf.append(inpf);
    tr.append(tdf);
    
    for(let i=1;i<=cantidadDemanda;i++){

        let td = document.createElement('td');
        let inp = document.createElement('input');
        inp.setAttribute('type','number');
        inp.setAttribute('class','celda');
        inp.setAttribute('placeholder','0.0');
        td.append(inp);
        tr.append(td);
    }

    //Agregamos el nuevo tr al table
    tbody.append(tr)
}



function calcularCoste(){

    // Obtener el list
    let trs = tbody.children;
    for(let i=0;i<cantidadOferta;i++){
        // Etamos dentro de un tr
        let tds = trs[i].children;
        let newArrayTr = [];

                // Oferta
                let inFirst = tds[0].querySelector('input');

                if(inFirst.value==""){
                    // El usuario no puso nada
                    oferta.push(0.0);
                }
                else{
                    oferta.push(parseFloat(inFirst.value));
                }
                
        for(let j=0;j<cantidadDemanda;j++){

            let input = tds[j+1].querySelector('input');

            if(input.value == ""){
                // El usuario dejo una casilla vacia, lo cual no es malo, solo que lo asignaremos como 0
                newArrayTr.push([0.0,true,0]);
            }else{
                newArrayTr.push([parseFloat(input.value),true,0]);
            }
        }
        list.push(newArrayTr);
    }

    // Obtener el demandList
    let trhs = thead.children[0];  // El unico tr de thead
    let ths = trhs.children;      // Todos los th del unico tr
    for(let k=0;k<cantidadDemanda;k++){
        // k+1 para omitir la casilla "Oferta/Demanda"
        let input = ths[k+1].querySelector('input');
        if(input.value==""){
            // El usuario no puso nada
            demanda.push(0.0);
        }else{
            demanda.push(parseFloat(input.value));
        }
    }

    // Antes de empezar debemos verificar si la cantidad de demanda es igual a la de la oferta
    let dA = 0;
    let oA = 0;

    for(let p=0;p<cantidadDemanda;p++){
        dA = dA+demanda[p];
    }
  
    for(let q=0;q<cantidadOferta;q++){
        oA = oA+oferta[q];
    }

    if(dA!=oA){
        aviso.style.alignItems='center';
        aviso.style.backgroundColor = '#e74c3c';
        mensaje.textContent = "La oferta y demanda deben de ser la misma";
        aviso.style.display = 'flex';

        list = [];
        demanda = [];
        oferta = [];

        setTimeout(()=>{
            aviso.style.display = 'none';
        }, 1500);


        
    }
    else{

        // Vamos a desahibilitar el boton
        boton.disabled=true;

        if(boton.disabled==true){
            console.log('Boton deshabilitado');
        }

        // Debemos de crear un contenedor results
        let resultsss = document.createElement('div');
        resultsss.setAttribute('class','results');
        t=t+1;
        resultsss.setAttribute('id',`r${t}`);

        let header = document.createElement('h4');
        header.textContent = `Resultados tabla ${t}`;
        resultsss.append(header);

        // Debemos agregarlo a cantidad
        cantidad.append(resultsss);

        let rutas = "Ruta -> ";
        // Ejecutar una primera vez
        buscarValorMasPequeno(list,demanda,oferta,rutas);


        // Cuando llegemos aqui, debemos de reiniciar todos los valores
        list = [];
        demanda = [];
        oferta = [];

        // Vamos a desahibilitar el boton
        boton.disabled=false;

        if(boton.disabled==true){
            console.log('El boton sigue deshabilitado');
        }
        else{
            console.log('El boton esta habilitado');
        }
    }

}


function buscarValorMasPequeno(ar,de,of,rut){

    let arreglo = JSON.parse(JSON.stringify(ar));
    let dem = JSON.parse(JSON.stringify(de));
    let ofe = JSON.parse(JSON.stringify(of));


    console.log(arreglo);

    let valor; 
    // Obtener el primer valor valido
    for(let a=0;a<cantidadOferta;a++){

        for(let b=0;b<cantidadDemanda;b++){
            if(arreglo[a][b][1]==true){
                valor = arreglo[a][b][0];

                // Obligar a salir del bucle
                b=arreglo[a].length;
                a=arreglo.length;

            }
        }
    }


    let celdasMenores = [];

    console.log(valor);

    // [ [0,1]     [2,5]    [9,3] ]

    for(let x=0;x<cantidadOferta;x++){

        for(let y=0;y<cantidadDemanda;y++){

            // Si la celda no esta bloqueada, entonces es candidata a ser usada
            if(arreglo[x][y][1]==true){

                if(arreglo[x][y][0] < valor){
                    console.log('se cumple este');
                    celdasMenores = [];          // Vaciar celdas Menores
                    valor = arreglo[x][y][0];       // Modificar el nuevo valor minimo
                    celdasMenores.push([x,y]);   // Anadir celda a celdas Menores
                }
                else{
                    if(arreglo[x][y][0] == valor ){
                        console.log('se cumplio este otro');
                        celdasMenores.push([x,y]);  // Anadir celda a celdas Menores
                    }
                }

            }
        }
    }


    /* 
        Podemos empezar con cualquier celda que tenga el valor minimo, 
        asi que ahora hay diferentes rutas para hacerlo
    */

    console.log('kkkkkkkkk');
    console.log(celdasMenores);


    // Si nomas hay una celda con el valor menor, entonces nomas se ejecutara una vez este for
    for(let camino = 0;camino<celdasMenores.length;camino++){
        // Pasarle la celda que va a tomar como camino
        resolver(arreglo,celdasMenores[camino],dem,ofe,rut + `[${celdasMenores[camino][0]+1},${celdasMenores[camino][1]+1}] `);
    }

}

function resolver(arResolver,coordenadas,deResolver,ofResolver,ruta){

  console.log('resolviendo');

  // No podemos los arreglo general, debemos usar una copia, 
  copia = JSON.parse(JSON.stringify(arResolver));
  copiaDemanda = JSON.parse(JSON.stringify(deResolver));
  copiaOferta = JSON.parse(JSON.stringify(ofResolver));
  
  y = coordenadas[0];
  x = coordenadas[1];

  if(copiaDemanda[x]>=copiaOferta[y]){

    console.log(copiaOferta);

    // Cuando la demanda sea mayor, la celda seguira teniendo el mismo costo, pero ahora tendra el valor de la oferta
    copia[y][x][2] = copiaOferta[y];

    copiaDemanda[x] = copiaDemanda[x] - copiaOferta[y];
    copiaOferta[y] = 0;

    // Cuando la oferta es igual a cero, se cancela toda la fila de al lado
    for(let j=0;j<cantidadDemanda;j++){
        copia[y][j][1] = false;
    }

    console.log(copiaOferta);
    
  }
  else{

    console.log(copiaDemanda);

    // Cuando la oferta sea mayor, la celda tendra el valor de la demanda
    copia[y][x][2] = copiaDemanda[x];

    copiaOferta[y] = copiaOferta[y] - copiaDemanda[x];
    copiaDemanda[x] = 0;

    console.log(copiaDemanda);


    // Cuando la demanda es igual a cero, se cancela toda la fila de al lado
    for(let j=0;j<cantidadOferta;j++){
        copia[j][x][1] = false;
    }
  }

  // Primero verificamos si todas las demandas y ofertas son igual a 0
  let demanda_oferta = 0;

  for(let p=0;p<cantidadDemanda;p++){
    demanda_oferta = demanda_oferta+copiaDemanda[p];
  }

  for(let q=0;q<cantidadOferta;q++){
    demanda_oferta = demanda_oferta+copiaOferta[q];
  }

  console.log(copia);

  console.log(demanda_oferta);
  console.log(copiaDemanda);
  console.log(copiaOferta);


  if(demanda_oferta<=0){

    // Ya terminamos
    let costeMinimo=0;
    
    // Debemos de mostrar el coste minimo
    for(let a=0;a<cantidadOferta;a++){
        for(let b=0;b<cantidadDemanda;b++){
            costeMinimo = costeMinimo + (copia[a][b][0]*copia[a][b][2]); 
        }
    }


    // Mostrar la ruta seguida
    console.log(ruta);
    console.log(`Coste Minimo: ${costeMinimo}`);

    


    let newResult = document.createElement('div');
    newResult.setAttribute('class','result');
    newResult.textContent = `${ruta}\n Coste Minimo: ${costeMinimo}`;

    let results = document.getElementById(`r${t}`); // El contenedor results
    results.append(newResult);


  }
  else{
    // Una vez que hicimos esto, volvemos a buscar la celda con el coste minimo
    buscarValorMasPequeno(copia,copiaDemanda,copiaOferta,ruta);
  }

}