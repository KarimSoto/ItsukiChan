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

    console.log(cantidadDemanda);
    console.log(cantidadOferta);

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

        demanda = [];
        oferta = [];
        list = [];

        setTimeout(()=>{
            aviso.style.display = 'none';
        }, 1500);

        
    }
    else{

        console.log(demanda);
        console.log(oferta);
        console.log(list);

        // Vamos a desahibilitar el boton
        boton.disabled=true;

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
        buscarPenalizacion(list,demanda,oferta,rutas);


        // Cuando llegemos aqui, debemos de reiniciar todos los valores
        list = [];
        demanda = [];
        oferta = [];
        boton.disabled=false;

    }
}

function buscarPenalizacion(copia,dP,oFp,ruta){

    console.log('penalizacion...');
    console.log(copia);
    console.log(dP);
    console.log(oFp);


    let penalizacionFilas = [];
    let penalizacionColumnas = [];
    let maxPen;
    let penalizaciones = []

    // Buscamos la penalizacion en cada fila
    for(let a=0;a<cantidadOferta;a++){

        let cantidadDisponibles = 0;
        let valor = 0;
        let celda = [];

        for(let b=0;b<cantidadDemanda;b++){
            if(copia[a][b][1]==true){
                cantidadDisponibles++;
                valor = copia[a][b][0];  // No importa si se sobre escribe, esa es la intencion
                celda = [a,b];           // Tampoco importa si se sobre escribe
            }
        }

        console.log(`fila ${a+1} cantidadDisponibles:${cantidadDisponibles}`);

        // Aqui terminamos una sola fila, nos hacen falta mas
        if(cantidadDisponibles>1){
            // Debemos calcular la penalizacion

            let min = valor; // Ya sabemos que por lo menos una celda disponible tiene ese valor
            let second = min;
            let minimos = [celda];

            for(let x=0;x<cantidadDemanda;x++){

                if(copia[a][x][1]==true){

                    // La celda puede afectar el valor minimo
                    if(copia[a][x][0]<min){
                        second = min;           // Minimo Anterior
                        min = copia[a][x][0];   // Nuevo minimo
                        minimos = [];           // Vaciar arreglo
                        minimos.push([a,x]);      // Anadir la celda del nuevo minimo
                    }
                    else{
                        if(copia[a][x][0]==min){
                            minimos.push([a,x]);   // Agregar otra celda que tambien contiene el minimo
                        }else{
                            if(copia[a][x][0]<second){
                                second=copia[a][x][0];
                            }else{
                                if(copia[a][x][0]>second && second == min){
                                    second = copia[a][x][0];
                                }
                            }
                        }
                    }

                }

                
            }

            min = second - min;
            penalizacionFilas.push([min,minimos]);

        }
    }


    // Buscamos la penalizacion en cada columna
    for(let j=0;j<cantidadDemanda;j++){

        let cantidadDisponibles = 0;
        let valor = 0;
        let celda = [];

        for(k=0;k<cantidadOferta;k++){
            if(copia[k][j][1]==true){
                cantidadDisponibles++;
                valor = copia[k][j][0];  // No importa si se sobre escribe, esa es la intencion
                celda = [k,j];           // Tampoco importa si se sobre escribe
            }
        }

        console.log(`Columnas ${j+1} cantidadDisponibles:${cantidadDisponibles}`);

        if(cantidadDisponibles>1){

            // Debemos calcular la penalizacion
            let min = valor; // Ya sabemos que por lo menos una celda disponible tiene ese valor
            let second = min;
            let minimos = [celda];

            for(let x=0;x<cantidadOferta;x++){

                if(copia[x][j][1]==true){
                    // Si la celda en cuestion esta disponible, puede afectar el valor minimo
                    if(copia[x][j][0]<min){
                        second = min;           // Minimo Anterior
                        min = copia[x][j][0];   // Nuevo minimo
                        minimos = [];           // Vaciar arreglo
                        minimos.push([x,j]);      // Anadir la celda del nuevo minimo
                    }
                    else{
                        if(copia[x][j][0]==min){
                            minimos.push([x,j]);   // Agregar otra celda que tambien contiene el minimo
                        }else{
                            if(copia[x][j][0]<second){
                                second = copia[x][j][0];
                            }
                            else{
                                if(copia[x][j][0]>second && second == min){
                                    second = copia[x][j][0];
                                }
                            }
                        }
                    }

                }

            }

            min = second - min;
            penalizacionColumnas.push([min,minimos]);


        }
    }


    let celdasAvailables = [];

    console.log('OSOSMA');
    console.log(penalizacionColumnas);
    console.log(penalizacionFilas);


    if(penalizacionFilas.length==0 && penalizacionColumnas.length==0){

        console.log('UPPPPP');
        /*
            Significa que hay casillas faltantes, pero no hay dos o mas casillas en una 
            misma columna o fila, por lo que no que se puede formar una penalizacion
        */

        let insideMin = 0;

        // Vamos a agregar a celdasAvailables, cualquiera que este en true y menor costo
        for(let t=0;t<cantidadOferta;t++){

            for(let u=0;u<cantidadDemanda;u++){
                
                if(copia[t][u][1]==true){
                    // Es candidato a ser minimo
                    insideMin = copia[t][u][0]; // No importa que se sobre escriba
                }
            }
        }


        // Si llegamos hasta aqui, insideMin ya tendra un valor valido y en true
        for(let t=0;t<cantidadOferta;t++){

            for(let u=0;u<cantidadDemanda;u++){
                
                if(copia[t][u][1]==true){
                    // Es candidato a ser minimo
                    if(copia[t][u][0]<insideMin){
                        insideMin = copia[t][u][0];
                        celdasAvailables = [];        // Eliminamos las celdas anteriores con un valor minimo falso
                        celdasAvailables.push([t,u]); // Agregamos las coordenas de la celda con el valor minimo
                    }
                    else{
                        if(copia[t][u][0]==insideMin){
                            celdasAvailables.push([t,u]); // Anadimos otras coordenadas de una celda que tambien tiene el valor minimo
                        }
                    }
                }
            }
        }

    }else{


        if(penalizacionFilas.length>0){
            maxPen = penalizacionFilas[0][0];
        }else{
            if(penalizacionColumnas.length>0){
                maxPen = penalizacionColumnas[0][0];
            }
        }

        

        for(let p=0;p<penalizacionFilas.length;p++){
            if(maxPen<penalizacionFilas[p][0]){
                // Significa que encontramos una penalizacion mas grande
                maxPen = penalizacionFilas[p][0];
                penalizaciones = [];   // Vaciar la lista de penalizaciones
                penalizaciones.push([penalizacionFilas[p][0],penalizacionFilas[p][1]]);   // Penalizacion, lista de nodos en la misma fila que tienen la misma penalizacion
            }
            else{
                if(maxPen==penalizacionFilas[p][0]){
                    // Significa que otra fila tiene candidatos tambien
                    penalizaciones.push([penalizacionFilas[p][0],penalizacionFilas[p][1]]);
                }
            }
        }


        for(let p=0;p<penalizacionColumnas.length;p++){
            if(maxPen<penalizacionColumnas[p][0]){
                // Significa que encontramos una penalizacion mas grande
                maxPen = penalizacionColumnas[p][0];
                penalizaciones = [];   // Vaciar la lista de penalizaciones
                penalizaciones.push([penalizacionColumnas[p][0],penalizacionColumnas[p][1]]);   // Penalizacion, lista de nodos en la misma fila que tienen la misma penalizacion
            }
            else{
                if(maxPen==penalizacionColumnas[p][0]){
                    // Significa que otra fila tiene candidatos tambien
                    penalizaciones.push([penalizacionColumnas[p][0],penalizacionColumnas[p][1]]);
                }
            }
        }

        for(let h=0;h<penalizaciones.length;h++){

            for(let g=0;g<penalizaciones[h][1].length;g++){
                celdasAvailables.push(penalizaciones[h][1][g]);
            }
        }

        for(let d=0;d<celdasAvailables.length;d++){

            for(let z=0;z<celdasAvailables.length;z++){
                if(d!=z && JSON.stringify(celdasAvailables[d])==JSON.stringify(celdasAvailables[z])){
                    celdasAvailables.splice(z,1);
                }
            }
        }
    }


    

    console.log(celdasAvailables);
    
    // Por cada celda disponible, vamos a crear un camino
    for(let batman=0;batman<celdasAvailables.length;batman++){
        let corX = celdasAvailables[batman][0];
        let corY = celdasAvailables[batman][1];
        resolver(copia,dP,oFp,corX,corY,ruta+`[${corX},${corY}] `);
    }

}


function resolver(listR,d,o,cX,cY,rutas){


    let copiaR = JSON.parse(JSON.stringify(listR));
    let demandaR = JSON.parse(JSON.stringify(d));
    let ofertaR = JSON.parse(JSON.stringify(o));


    
    
    if(demandaR[cY]>ofertaR[cX]){

        // Si la demanda es mayor que la oferta   10 > 5
        demandaR[cY] = demandaR[cY] - ofertaR[cX];

        // Pasarle el valor antes de que ofertaR[cX] sea 0
        copiaR[cX][cY][2] = ofertaR[cX];

        ofertaR[cX] = 0;

        // Poner en false toda la fila al lado de oferta
        for(let v=0;v<cantidadDemanda;v++){
            copiaR[cX][v][1] = false;
        }

    }else{

        if(demandaR[cY]==ofertaR[cX]){
            // Si ambos son iguales
            copiaR[cX][cY][2] = ofertaR[cX];  // Es lo mismo que si hago v = demandaR[cY];
            demandaR[cY] = 0;
            ofertaR[cX] = 0;


            // Poner en false toda la fila al lado de oferta
            for(let v=0;v<cantidadDemanda;v++){
                copiaR[cX][v][1] = false;
            }

            // Poner en false la columna debajo de demanda
            for(let s=0;s<cantidadOferta;s++){
                copiaR[s][cY][1] = false; 
            }

        }
        else{
            // Significa que oferta es mayor 10 > 5
            ofertaR[cX] = ofertaR[cX] - demandaR[cY];

            // Antes de que demandaR[cY] sea 0
            copiaR[cX][cY][2] = demandaR[cY];

            demandaR[cY] = 0;

            // Poner en false la columna debajo de demanda
            for(let s=0;s<cantidadOferta;s++){
                copiaR[s][cY][1] = false; 
            }
        }
    }


    let demanda_oferta = 0;

    for(let p=0;p<cantidadDemanda;p++){
        demanda_oferta = demanda_oferta+demandaR[p];
    }

    for(let q=0;q<cantidadOferta;q++){
        demanda_oferta = demanda_oferta+ofertaR[q];
    }

    console.log(demanda_oferta);

    if(demanda_oferta>0){
        // Significa que aun no hemos terminado
        buscarPenalizacion(copiaR,demandaR,ofertaR,rutas);
    }
    else{
        console.log('ocurrio esto');
        // Ya terminamos
        let costeMinimo=0;
        
        // Debemos de mostrar el coste minimo
        for(let a=0;a<cantidadOferta;a++){
            for(let b=0;b<cantidadDemanda;b++){
                costeMinimo = costeMinimo + (copiaR[a][b][0]*copiaR[a][b][2]); 
            }
        }
        

        let newResult = document.createElement('div');
        newResult.setAttribute('class','result');
        newResult.textContent = `${rutas}\n Coste Minimo: ${costeMinimo}`;

        let results = document.getElementById(`r${t}`); // El contenedor results
        results.append(newResult);
    }
    
}