let cantidadDemanda = 1;
let cantidadOferta = 1;
let list =[];
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
        for(let tr in trs){
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

        setTimeout(()=>{
            aviso.style.display = 'none';
        }, 1500);

    }else{
        // Vamos a calcular el costo
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
        esquinaNoroeste(list,demanda,oferta,rutas);

        // Una vez aqui, debemos resetear el valor
        list = [];
        demanda = [];
        oferta = [];
        boton.disabled = false;
    }
}


function esquinaNoroeste(list,demanda,oferta,rutas){

    // No necesitamos crear copias
    
    // Obtener la primer celda valida

    for(let a=0;a<cantidadOferta;a++){

        for(let b=0;b<cantidadDemanda;b++){
            if(list[a][b][1]==true){
 
                // Extender el string rutas
                rutas = rutas + `[${a+1},${b+1}] `;

                if(demanda[b]>oferta[a]){
                    // Significa que la demanda es mayor
                    demanda[b] = demanda[b] - oferta[a]; // d = 10 - 5

                    // Antes de que oferta[a] sea 0
                    list[a][b][2] = oferta[a];            // 5 
                    
                    // Oferta pasara a ser 0
                    oferta[a] = 0;

                    // Debemos cancelar toda la fila de al lado de oferta
                    for(let y=0;y<cantidadDemanda;y++){
                        list[a][y][1] = false;
                    }

                }
                else{

                    if(demanda[b]==oferta[a]){

                        // Cualquiera de los dos
                        list[a][b][2] = demanda[b];

                        // Ambos son iguales
                        demanda[b] = 0;
                        oferta[a] = 0;

                        // Debemos cancelar toda la fila 
                        for(let y=0;y<cantidadDemanda;y++){
                            list[a][y][1] = false;
                        }

                        // Debemos cancelar toda la columna tambien
                        for(let x=0;x<cantidadOferta;x++){
                            list[x][b][1] = false;
                        }

                    }else{

                        // Significa que la oferta es mayor
                        oferta[a] = oferta[a] - demanda[b];

                        // Asignar valor antes de que demanda sea 0
                        list[a][b][2] = demanda[b];
                        
                        demanda[b] = 0;

                        // Debemos cancelar toda la columna debajo de demanda
                        for(let x=0;x<cantidadOferta;x++){
                            list[x][b][1] = false;
                        }
                    }
                }

                // Obligar a salir del bucle
                b=list[a].length;
                a=list.length;
            }
        }
    }

    // Si llegamos aqui, debemos verificar si es el fin, si no, volver a ejecutar esta funcion
    let DEOF = 0;

    for(let p=0;p<cantidadDemanda;p++){
        DEOF= DEOF+demanda[p];
    }
  
    for(let q=0;q<cantidadOferta;q++){
        DEOF = DEOF+oferta[q];
    }

    if(DEOF>0){
        // Significa que no hemos llegado al final
        esquinaNoroeste(list,demanda,oferta,rutas);
    }else{
        // LLegamos al final

        let esquina = 0;

        // Obtener el coste Minimo
        for(let a=0;a<cantidadOferta;a++){
            for(let b=0;b<cantidadDemanda;b++){
                esquina = esquina + (list[a][b][0]*list[a][b][2]); 
            }
        }


        // Mostrar en el HTML el resultado
        let newResult = document.createElement('div');
        newResult.setAttribute('class','result');
        newResult.textContent = `${rutas}\n Coste Minimo: ${esquina}`;

        let results = document.getElementById(`r${t}`); // El contenedor results
        results.append(newResult);

    }
}
